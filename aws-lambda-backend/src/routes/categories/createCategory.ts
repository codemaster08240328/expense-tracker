import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCategory } from '@services/categories/categoryService';

export async function createCategoryHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { name, color, monthlyBudget } = JSON.parse(event.body || '{}');
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing category name' }),
      };
    }
    const category = await createCategory({ name, color, monthlyBudget });
    return {
      statusCode: 201,
      body: JSON.stringify(category),
    };
  } catch (err) {
    console.error('createCategory error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
