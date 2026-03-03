import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const EXPENSES_TABLE = process.env.EXPENSES_TABLE || 'Expenses';

export async function getAllExpenses() {
  const command = new ScanCommand({ TableName: EXPENSES_TABLE });
  const result = await client.send(command);
  return (result.Items || []).map((item) => ({
    id: item.id.S,
    amount: Number(item.amount.N),
    categoryId: item.categoryId.S,
    date: item.date.S,
    description: item.description?.S,
  }));
}

export async function createExpense({
  amount,
  categoryId,
  date,
  description,
}: {
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
}) {
  const id = uuidv4();
  const command = new PutItemCommand({
    TableName: EXPENSES_TABLE,
    Item: {
      id: { S: id },
      amount: { N: amount.toString() },
      categoryId: { S: categoryId },
      date: { S: date },
      ...(description ? { description: { S: description } } : {}),
    },
  });
  await client.send(command);
  return { id, amount, categoryId, date, description };
}

export async function updateExpense(
  id: string,
  {
    amount,
    categoryId,
    date,
    description,
  }: { amount: number; categoryId: string; date: string; description?: string },
) {
  const command = new UpdateItemCommand({
    TableName: EXPENSES_TABLE,
    Key: { id: { S: id } },
    UpdateExpression:
      'SET amount = :amount, categoryId = :categoryId, #d = :date, description = :description',
    ExpressionAttributeNames: { '#d': 'date' },
    ExpressionAttributeValues: {
      ':amount': { N: amount.toString() },
      ':categoryId': { S: categoryId },
      ':date': { S: date },
      ':description': description ? { S: description } : { NULL: true },
    },
    ReturnValues: 'ALL_NEW',
  });
  const result = await client.send(command);
  return {
    id,
    amount,
    categoryId,
    date,
    description,
  };
}

export async function deleteExpense(id: string) {
  const command = new DeleteItemCommand({
    TableName: EXPENSES_TABLE,
    Key: { id: { S: id } },
  });
  await client.send(command);
}
