import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createExpense } from '@services/expenses/expenseService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function createExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { amount, categoryId, date, description } = JSON.parse(
      event.body || '{}',
    );
    if (!amount || !categoryId || !date) {
      return response(400, { message: 'Missing required fields' });
    }
    const userId = getUserIdFromEvent(event);
    const expense = await createExpense({
      amount,
      categoryId,
      date,
      description,
      userId,
    });
    return response(201, expense);
  } catch (err) {
    console.error('createExpense error:', err);
    return response(500, { message: 'Internal server error' });
  }

  function response(
    statusCode: number,
    body: Record<string, unknown>,
  ): APIGatewayProxyResult {
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
