import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllExpenses } from '@services/expenses/expenseService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function getExpensesHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserIdFromEvent(event);
    const expenses = await getAllExpenses(userId);
    return response(200, expenses);
  } catch (err) {
    console.error('getExpenses error:', err);
    return response(500, { message: 'Internal server error' });
  }

  function response(
    statusCode: number,
    body: Record<string, unknown> | unknown[] | string,
  ): APIGatewayProxyResult {
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
