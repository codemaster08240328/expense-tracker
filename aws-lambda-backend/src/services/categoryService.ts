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
const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE || 'Categories';

export async function getAllCategories() {
  const command = new ScanCommand({ TableName: CATEGORIES_TABLE });
  const result = await client.send(command);
  return (result.Items || []).map((item) => ({
    id: item.id.S,
    name: item.name.S,
    color: item.color?.S,
  }));
}

export async function createCategory({
  name,
  color,
}: {
  name: string;
  color?: string;
}) {
  const id = uuidv4();
  const command = new PutItemCommand({
    TableName: CATEGORIES_TABLE,
    Item: {
      id: { S: id },
      name: { S: name },
      ...(color ? { color: { S: color } } : {}),
    },
  });
  await client.send(command);
  return { id, name, color };
}

export async function updateCategory(
  id: string,
  { name, color }: { name: string; color?: string },
) {
  const command = new UpdateItemCommand({
    TableName: CATEGORIES_TABLE,
    Key: { id: { S: id } },
    UpdateExpression: 'SET #n = :name, color = :color',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: {
      ':name': { S: name },
      ':color': color ? { S: color } : { NULL: true },
    },
    ReturnValues: 'ALL_NEW',
  });
  const result = await client.send(command);
  return {
    id,
    name,
    color,
  };
}

export async function deleteCategory(id: string) {
  const command = new DeleteItemCommand({
    TableName: CATEGORIES_TABLE,
    Key: { id: { S: id } },
  });
  await client.send(command);
}
