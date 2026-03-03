import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
async function createUsersTable() {
  const command = new CreateTableCommand({
    TableName: 'Users',
    AttributeDefinitions: [
      { AttributeName: 'email', AttributeType: 'S' },
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
  try {
    await client.send(command);
    console.log('Users table created');
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('Users table already exists');
    } else {
      console.error('Error creating table:', err);
    }
  }
}
createUsersTable();
