import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hash } from 'bcryptjs';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'; // eslint-disable-line @typescript-eslint/no-var-requires
import { putUser, getUserByEmail } from '@services/auth/userService';

export async function signupHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log('Signup event body:', event.body);
    const { displayName, email, password } = JSON.parse(event.body || '{}');
    if (!displayName || !email || !password) {
      console.log('Missing fields:', { displayName, email, password });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing fields' }),
      };
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      console.log('Email already exists:', email);
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Email already exists' }),
      };
    }
    const hashedPassword = await hash(password, 10);
    const user = { id: uuidv4(), displayName, email, password: hashedPassword };
    await putUser(user);
    // TODO: Generate JWT token
    console.log('User created:', user);
    return {
      statusCode: 201,
      body: JSON.stringify({
        token: 'mock-token',
        user: { id: user.id, displayName, email },
      }),
    };
  } catch (err) {
    console.error('Signup error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
