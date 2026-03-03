import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const USERS_TABLE = process.env.USERS_TABLE || 'Users';

export async function getUserByEmail(email: string) {
  try {
    const command = new GetItemCommand({
      TableName: USERS_TABLE,
      Key: { email: { S: email } },
    });
    const result = await client.send(command);
    if (!result.Item) return null;
    return {
      id: result.Item.id.S,
      displayName: result.Item.displayName.S,
      email: result.Item.email.S,
      password: result.Item.password.S,
    };
  } catch (err) {
    console.error('getUserByEmail error:', err);
    throw err;
  }
}

export async function putUser(user: {
  id: string;
  displayName: string;
  email: string;
  password: string;
}) {
  try {
    const command = new PutItemCommand({
      TableName: USERS_TABLE,
      Item: {
        id: { S: user.id },
        displayName: { S: user.displayName },
        email: { S: user.email },
        password: { S: user.password },
      },
    });
    await client.send(command);
  } catch (err) {
    console.error('putUser error:', err);
    throw err;
  }
}
