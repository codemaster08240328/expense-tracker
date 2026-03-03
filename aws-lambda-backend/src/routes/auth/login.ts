import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { compare } from 'bcryptjs';
import { getUserByEmail } from '@services/auth/userService';

export async function loginHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing fields' }),
      };
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
    const valid = await compare(password, user.password || '');
    if (!valid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
    // TODO: Generate JWT token
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: 'mock-token',
        user: { id: user.id, displayName: user.displayName, email: user.email },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
