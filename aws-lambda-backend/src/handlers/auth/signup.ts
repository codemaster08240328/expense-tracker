import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hash } from 'bcryptjs';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'; // eslint-disable-line @typescript-eslint/no-var-requires
import { putUser, getUserByEmail } from '@services/auth/userService';
import jwt from 'jsonwebtoken';
import { createCategory } from '@services/categories/categoryService';

export async function signupHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log('Signup event body:', event.body);
    const { displayName, email, password } = JSON.parse(event.body || '{}');
    if (!displayName || !email || !password) {
      console.log('Missing fields:', { displayName, email, password });
      return response(400, { message: 'Missing fields' });
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      console.log('Email already exists:', email);
      return response(409, { message: 'Email already exists' });
    }
    const hashedPassword = await hash(password, 10);
    const user = { id: uuidv4(), displayName, email, password: hashedPassword };
    await putUser(user);
    // create default categories for this new user
    const defaults = [
      { name: 'Food', monthlyBudget: 50 },
      { name: 'Transport', monthlyBudget: 20 },
      { name: 'Entertainment', monthlyBudget: 30 },
      { name: 'Utilities', monthlyBudget: 50 },
      { name: 'Health', monthlyBudget: 100 },
    ];
    try {
      await Promise.all(
        defaults.map((d) => createCategory({ ...d, userId: user.id })),
      );
    } catch (err) {
      console.error('create default categories error:', err);
    }
    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: user.id, email, displayName }, secret, {
      expiresIn: '7d',
    });
    console.log('User created:', user);
    return response(201, {
      token,
      user: { id: user.id, displayName, email },
    });
  } catch (err) {
    console.error('Signup error:', err);
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
