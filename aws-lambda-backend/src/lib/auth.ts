import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';

export function getUserIdFromEvent(
  event: APIGatewayProxyEvent,
): string | undefined {
  const auth = event.headers?.Authorization || event.headers?.authorization;
  if (!auth) return undefined;
  const parts = String(auth).split(' ');
  const token =
    parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : parts[0];
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload: any = jwt.verify(token, secret);
    return payload?.sub;
  } catch (err) {
    console.error('invalid token', err);
    return undefined;
  }
}
