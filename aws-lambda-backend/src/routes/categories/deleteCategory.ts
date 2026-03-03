import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteCategory } from '@services/categories/categoryService';

export async function deleteCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing category id' }),
      };
    }
    await deleteCategory(id);
    return {
      statusCode: 204,
      body: '',
    };
  } catch (err) {
    console.error('deleteCategory error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
