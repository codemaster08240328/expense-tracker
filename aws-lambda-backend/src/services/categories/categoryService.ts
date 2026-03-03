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
const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE || 'Categories';

export async function getAllCategories(userId?: string) {
  const params: Record<string, unknown> = { TableName: CATEGORIES_TABLE };
  if (userId) {
    params.FilterExpression = 'userId = :uid';
    params.ExpressionAttributeValues = { ':uid': { S: userId } };
  }
  const command = new ScanCommand(params as unknown as ScanCommandInput);
  const result = await client.send(command);
  return (result.Items || []).map((item) => ({
    id: item.id.S,
    name: item.name.S,
    color: item.color?.S,
    monthlyBudget: item.monthlyBudget
      ? Number(item.monthlyBudget.N)
      : undefined,
    userId: item.userId?.S,
  }));
}

export async function createCategory({
  name,
  color,
  monthlyBudget,
  userId,
}: {
  name: string;
  color?: string;
  monthlyBudget?: number;
  userId?: string;
}) {
  console.log('createCategory input:', { name, color, monthlyBudget });
  const id = uuidv4();
  const command = new PutItemCommand({
    TableName: CATEGORIES_TABLE,
    Item: {
      id: { S: id },
      ...(userId ? { userId: { S: userId } } : {}),
      name: { S: name },
      ...(color ? { color: { S: color } } : {}),
      ...(monthlyBudget !== undefined
        ? { monthlyBudget: { N: monthlyBudget.toString() } }
        : {}),
    },
  });
  await client.send(command);
  console.log('createCategory result:', { id, name, color, monthlyBudget });
  return { id, name, color, monthlyBudget, userId };
}

export async function updateCategory(
  id: string,
  {
    name,
    color,
    monthlyBudget,
  }: { name: string; color?: string; monthlyBudget?: number },
  userId?: string,
) {
  console.log('updateCategory input:', { id, name, color, monthlyBudget });
  let updateExpr = 'SET #n = :name';
  const exprAttrNames: Record<string, string> = { '#n': 'name' };
  const exprAttrValues: Record<string, unknown> = { ':name': { S: name } };
  if (color !== undefined) {
    updateExpr += ', color = :color';
    exprAttrValues[':color'] = color ? { S: color } : { NULL: true };
  }
  if (monthlyBudget !== undefined) {
    updateExpr += ', monthlyBudget = :monthlyBudget';
    exprAttrValues[':monthlyBudget'] = { N: monthlyBudget.toString() };
  }
  const params: Record<string, unknown> = {
    TableName: CATEGORIES_TABLE,
    Key: { id: { S: id } },
    UpdateExpression: updateExpr,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues,
    ReturnValues: 'ALL_NEW',
  };
  if (userId) {
    params.ConditionExpression = 'userId = :uid';
    params.ExpressionAttributeValues = {
      ...exprAttrValues,
      ':uid': { S: userId },
    };
  }
  const command = new UpdateItemCommand(
    params as unknown as UpdateItemCommandInput,
  );
  const result = await client.send(command);
  console.log('updateCategory result:', result);
  return {
    id,
    name,
    color,
    monthlyBudget,
  };
}

export async function deleteCategory(id: string, userId?: string) {
  const params: Record<string, unknown> = {
    TableName: CATEGORIES_TABLE,
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
