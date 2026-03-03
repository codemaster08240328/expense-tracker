import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCategory } from '@services/categories/categoryService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function createCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { name, color, monthlyBudget } = JSON.parse(event.body || '{}');
    if (!name) {
      return response(400, { message: 'Missing category name' });
    }
    const userId = getUserIdFromEvent(event);
    const category = await createCategory({
      name,
      color,
      monthlyBudget,
      userId,
    });
    return response(201, category);
  } catch (err) {
    console.error('createCategory error:', err);
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
