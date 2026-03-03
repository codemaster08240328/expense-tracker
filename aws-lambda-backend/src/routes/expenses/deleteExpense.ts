import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteExpense } from '@services/expenses/expenseService';

export async function deleteExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing expense id' }),
      };
    }
    await deleteExpense(id);
    return {
      statusCode: 204,
      body: '',
    };
  } catch (err) {
    console.error('deleteExpense error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
