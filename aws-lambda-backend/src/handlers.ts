import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { signupHandler } from './routes/auth/signup';
import { loginHandler } from './routes/auth/login';
import { getCategoriesHandler } from './routes/categories/getCategories';
import { createCategoryHandler } from './routes/categories/createCategory';
import { updateCategoryHandler } from './routes/categories/updateCategory';
import { deleteCategoryHandler } from './routes/categories/deleteCategory';
import { getExpensesHandler } from './routes/expenses/getExpenses';
import { createExpenseHandler } from './routes/expenses/createExpense';
import { updateExpenseHandler } from './routes/expenses/updateExpense';
import { deleteExpenseHandler } from './routes/expenses/deleteExpense';

export async function main(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const { path, httpMethod } = event;
  const normalizedPath = path.replace(/\/+$/, ''); // Remove trailing slash
  console.log('Request:', { path, normalizedPath, httpMethod });

  // Auth
  if (normalizedPath === '/api/auth/signup' && httpMethod === 'POST') {
    return signupHandler(event);
  }
  if (normalizedPath === '/api/auth/login' && httpMethod === 'POST') {
    return loginHandler(event);
  }
  // Categories
  if (normalizedPath === '/api/categories' && httpMethod === 'GET') {
    return getCategoriesHandler(event);
  }
  if (normalizedPath === '/api/categories' && httpMethod === 'POST') {
    return createCategoryHandler(event);
  }
  if (
    /^\/api\/categories\/[^/]+$/.test(normalizedPath) &&
    httpMethod === 'PUT'
  ) {
    event.pathParameters = { id: normalizedPath.split('/').pop() };
    return updateCategoryHandler(event);
  }
  if (
    /^\/api\/categories\/[^/]+$/.test(normalizedPath) &&
    httpMethod === 'DELETE'
  ) {
    event.pathParameters = { id: normalizedPath.split('/').pop() };
    return deleteCategoryHandler(event);
  }
  // Expenses
  if (normalizedPath === '/api/expenses' && httpMethod === 'GET') {
    return getExpensesHandler(event);
  }
  if (normalizedPath === '/api/expenses' && httpMethod === 'POST') {
    return createExpenseHandler(event);
  }
  if (/^\/api\/expenses\/[^/]+$/.test(normalizedPath) && httpMethod === 'PUT') {
    event.pathParameters = { id: normalizedPath.split('/').pop() };
    return updateExpenseHandler(event);
  }
  if (
    /^\/api\/expenses\/[^/]+$/.test(normalizedPath) &&
    httpMethod === 'DELETE'
  ) {
    event.pathParameters = { id: normalizedPath.split('/').pop() };
    return deleteExpenseHandler(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
}
