import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteCategory } from '@services/categories/categoryService';
import { getUserIdFromEvent } from '../../lib/auth';

export async function deleteCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return response(400, { message: 'Missing category id' });
    }
    const userId = getUserIdFromEvent(event);
    await deleteCategory(id, userId);
    return response(204, '');
  } catch (err) {
    console.error('deleteCategory error:', err);
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
