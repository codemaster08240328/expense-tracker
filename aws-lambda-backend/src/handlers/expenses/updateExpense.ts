import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateExpense } from '@services/expenses/expenseService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function updateExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    const { amount, categoryId, date, description } = JSON.parse(
      event.body || '{}',
    );
    if (!id || !amount || !categoryId || !date) {
      return response(400, { message: 'Missing required fields' });
    }
    const userId = getUserIdFromEvent(event);
    const expense = await updateExpense(
      id,
      { amount, categoryId, date, description },
      userId,
    );
    return response(200, expense);
  } catch (err) {
    console.error('updateExpense error:', err);
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
      body: JSON.stringify(body),
    };
  }
}
