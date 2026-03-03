import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
  PutItemCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from '@aws-sdk/client-dynamodb';
// @ts-expect-error - uuid does not have TypeScript types
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const EXPENSES_TABLE = process.env.EXPENSES_TABLE || 'Expenses';

export async function getAllExpenses(userId?: string) {
  const params: Record<string, unknown> = { TableName: EXPENSES_TABLE };
  if (userId) {
    params.FilterExpression = 'userId = :uid';
    params.ExpressionAttributeValues = { ':uid': { S: userId } };
  }
  const command = new ScanCommand(params as unknown as ScanCommandInput);
  const result = await client.send(command);
  return (result.Items || []).map((item) => ({
    id: item.id.S,
    amount: Number(item.amount.N),
    categoryId: item.categoryId.S,
    date: item.date.S,
    description: item.description?.S,
    userId: item.userId?.S,
  }));
}

export async function createExpense({
  amount,
  categoryId,
  date,
  description,
  userId,
}: {
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  userId?: string;
}) {
  const id = uuidv4();
  const command = new PutItemCommand({
    TableName: EXPENSES_TABLE,
    Item: {
      id: { S: id },
      ...(userId ? { userId: { S: userId } } : {}),
      amount: { N: amount.toString() },
      categoryId: { S: categoryId },
      date: { S: date },
      ...(description ? { description: { S: description } } : {}),
    },
  });
  await client.send(command);
  return { id, amount, categoryId, date, description, userId };
}

export async function updateExpense(
  id: string,
  {
    amount,
    categoryId,
    date,
    description,
  }: { amount: number; categoryId: string; date: string; description?: string },
  userId?: string,
) {
  const exprValues: Record<string, unknown> = {
    ':amount': { N: amount.toString() },
    ':categoryId': { S: categoryId },
    ':date': { S: date },
    ':description': description ? { S: description } : { NULL: true },
  };
  const params: Record<string, unknown> = {
    TableName: EXPENSES_TABLE,
    Key: { id: { S: id } },
    UpdateExpression:
      'SET amount = :amount, categoryId = :categoryId, #d = :date, description = :description',
    ExpressionAttributeNames: { '#d': 'date' },
    ExpressionAttributeValues: exprValues,
    ReturnValues: 'ALL_NEW',
  };
  if (userId) {
    params.ConditionExpression = 'userId = :uid';
    params.ExpressionAttributeValues = { ...exprValues, ':uid': { S: userId } };
  }
  const command = new UpdateItemCommand(
    params as unknown as UpdateItemCommandInput,
  );
  await client.send(command);
  return {
    id,
    amount,
    categoryId,
    date,
    description,
  };
}

export async function deleteExpense(id: string, userId?: string) {
  const params: Record<string, unknown> = {
    TableName: EXPENSES_TABLE,
    Key: { id: { S: id } },
  };
  if (userId) {
    params.ConditionExpression = 'userId = :uid';
    params.ExpressionAttributeValues = { ':uid': { S: userId } };
  }
  const command = new DeleteItemCommand(
    params as unknown as DeleteItemCommandInput,
  );
  await client.send(command);
}
