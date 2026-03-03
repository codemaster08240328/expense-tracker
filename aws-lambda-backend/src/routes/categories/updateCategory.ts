import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateCategory } from '@services/categories/categoryService';

export async function updateCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    const { name, color, monthlyBudget } = JSON.parse(event.body || '{}');
    if (!id || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing category id or name' }),
      };
    }
    const category = await updateCategory(id, { name, color, monthlyBudget });
    return {
      statusCode: 200,
      body: JSON.stringify(category),
    };
  } catch (err) {
    console.error('updateCategory error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
