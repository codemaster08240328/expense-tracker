import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateExpense } from '@services/expenses/expenseService';

export async function updateExpenseHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    const { amount, categoryId, date, description } = JSON.parse(
      event.body || '{}',
    );
    if (!id || !amount || !categoryId || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }
    const expense = await updateExpense(id, {
      amount,
      categoryId,
      date,
      description,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(expense),
    };
  } catch (err) {
    console.error('updateExpense error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
