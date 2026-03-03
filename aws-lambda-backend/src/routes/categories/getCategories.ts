import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllCategories } from '@services/categories/categoryService';

export async function getCategoriesHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const categories = await getAllCategories();
    return {
      statusCode: 200,
      body: JSON.stringify(categories),
    };
  } catch (err) {
    console.error('getCategories error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
