import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteExpense } from '@services/expenses/expenseService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function deleteExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return response(400, { message: 'Missing expense id' });
    }
    const userId = getUserIdFromEvent(event);
    await deleteExpense(id, userId);
    return response(204, '');
  } catch (err) {
    console.error('deleteExpense error:', err);
    return response(500, { message: 'Internal server error' });
  }

  function response(statusCode: number, body: any): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    };
  }
}
