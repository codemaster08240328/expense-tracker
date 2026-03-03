import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllExpenses } from '@services/expenses/expenseService';

export async function getExpensesHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const expenses = await getAllExpenses();
    return {
      statusCode: 200,
      body: JSON.stringify(expenses),
    };
  } catch (err) {
    console.error('getExpenses error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
