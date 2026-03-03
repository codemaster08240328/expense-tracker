import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
async function createTable(params) {
  try {
    await client.send(new CreateTableCommand(params));
    console.log(`Table ${params.TableName} created`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table ${params.TableName} already exists`);
    } else {
      console.error(`Error creating table ${params.TableName}:`, err);
    }
  }
}
async function main() {
  await createTable({
    TableName: 'Users',
    AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await createTable({
    TableName: 'Categories',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      // monthlyBudget is not a key, so not needed here
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await createTable({
    TableName: 'Expenses',
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
}
main();
