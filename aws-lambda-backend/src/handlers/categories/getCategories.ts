import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllCategories } from '@services/categories/categoryService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function getCategoriesHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserIdFromEvent(event);
    const categories = await getAllCategories(userId);
    return response(200, categories);
  } catch (err) {
    console.error('getCategories error:', err);
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
