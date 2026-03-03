import type { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { getUserIdFromEvent } from './auth';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const mockVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>;

function event(headers: Record<string, string> = {}): APIGatewayProxyEvent {
  return { headers } as unknown as APIGatewayProxyEvent;
}

describe('getUserIdFromEvent', () => {
  beforeEach(() => {
    mockVerify.mockReset();
    delete process.env.JWT_SECRET;
  });

  it('returns undefined when no Authorization header', () => {
    expect(getUserIdFromEvent(event({}))).toBeUndefined();
    expect(getUserIdFromEvent(event({ other: 'x' }))).toBeUndefined();
    expect(mockVerify).not.toHaveBeenCalled();
  });

  it('extracts token from "Bearer <token>" and returns payload sub', () => {
    mockVerify.mockReturnValue({ sub: 'user-123' } as unknown as ReturnType<
      typeof jwt.verify
    >);
    const result = getUserIdFromEvent(
      event({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.xxx' }),
    );
    expect(result).toBe('user-123');
    expect(mockVerify).toHaveBeenCalledWith(
      'eyJhbGciOiJIUzI1NiJ9.xxx',
      'dev-secret',
    );
  });

  it('uses raw header value as token when not Bearer format', () => {
    mockVerify.mockReturnValue({ sub: 'user-456' } as unknown as ReturnType<
      typeof jwt.verify
    >);
    const result = getUserIdFromEvent(
      event({ authorization: 'some-token-without-bearer' }),
    );
    expect(result).toBe('user-456');
    expect(mockVerify).toHaveBeenCalledWith(
      'some-token-without-bearer',
      'dev-secret',
    );
  });

  it('returns undefined when jwt.verify throws', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    mockVerify.mockImplementation(() => {
      throw new Error('invalid token');
    });
    const result = getUserIdFromEvent(
      event({ Authorization: 'Bearer bad-token' }),
    );
    expect(result).toBeUndefined();
    spy.mockRestore();
  });

  it('uses JWT_SECRET from env when set', () => {
    process.env.JWT_SECRET = 'my-secret';
    mockVerify.mockReturnValue({ sub: 'uid' } as unknown as ReturnType<
      typeof jwt.verify
    >);
    getUserIdFromEvent(event({ Authorization: 'Bearer t' }));
    expect(mockVerify).toHaveBeenCalledWith('t', 'my-secret');
  });
});
