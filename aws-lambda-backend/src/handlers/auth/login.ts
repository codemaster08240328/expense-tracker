import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { compare } from 'bcryptjs';
import { getUserByEmail } from '@services/auth/userService';
import jwt from 'jsonwebtoken';

export async function loginHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return response(400, { message: 'Missing fields' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return response(401, { message: 'Invalid credentials' });
    }

    const valid = await compare(password, user.password || '');
    if (!valid) {
      return response(401, { message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign(
      { sub: user.id, email: user.email, displayName: user.displayName },
      secret,
      { expiresIn: '7d' },
    );
    return response(200, {
      token,
      user: { id: user.id, displayName: user.displayName, email: user.email },
    });
  } catch (err) {
    return response(500, { message: 'Internal server error' });
  }
}

function response(
  statusCode: number,
  body: Record<string, unknown>,
): APIGatewayProxyResult {
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
