import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createExpense } from '@services/expenses/expenseService';

export async function createExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { amount, categoryId, date, description } = JSON.parse(
      event.body || '{}',
    );
    if (!amount || !categoryId || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }
    const expense = await createExpense({
      amount,
      categoryId,
      date,
      description,
    });
    return {
      statusCode: 201,
      body: JSON.stringify(expense),
    };
  } catch (err) {
    console.error('createExpense error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
