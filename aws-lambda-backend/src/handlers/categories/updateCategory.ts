import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateCategory } from '@services/categories/categoryService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function updateCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    const { name, color, monthlyBudget } = JSON.parse(event.body || '{}');
    if (!id || !name) {
      return response(400, { message: 'Missing category id or name' });
    }
    const userId = getUserIdFromEvent(event);
    const category = await updateCategory(
      id,
      { name, color, monthlyBudget },
      userId,
    );
    return response(200, category);
  } catch (err) {
    console.error('updateCategory error:', err);
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
