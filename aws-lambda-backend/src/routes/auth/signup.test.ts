import { signupHandler } from './signup';
import { getUserByEmail, putUser } from '@services/auth/userService';
import { hash } from 'bcryptjs';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('@services/auth/userService', () => ({
  getUserByEmail: jest.fn(),
  putUser: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-uuid'),
}));

const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<
  typeof getUserByEmail
>;
const mockPutUser = putUser as jest.MockedFunction<typeof putUser>;
const mockHash = hash as jest.MockedFunction<typeof hash>;

function event(body: object): APIGatewayProxyEvent {
  return {
    body: JSON.stringify(body),
    headers: {},
  } as APIGatewayProxyEvent;
}

describe('signupHandler', () => {
  beforeEach(() => {
    mockGetUserByEmail.mockReset();
    mockPutUser.mockReset();
    (mockHash as jest.Mock).mockResolvedValue('hashed-password');
  });

  it('returns 400 when displayName is missing', async () => {
    const res = await signupHandler(event({ email: 'a@b.com', password: 'p' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe('Missing fields');
    expect(mockPutUser).not.toHaveBeenCalled();
  });

  it('returns 400 when email is missing', async () => {
    const res = await signupHandler(event({ displayName: 'A', password: 'p' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe('Missing fields');
  });

  it('returns 400 when password is missing', async () => {
    const res = await signupHandler(
      event({ displayName: 'A', email: 'a@b.com' }),
    );
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe('Missing fields');
  });

  it('returns 409 when email already exists', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: 'existing',
      displayName: 'X',
      email: 'a@b.com',
      password: 'h',
    });
    const res = await signupHandler(
      event({ displayName: 'A', email: 'a@b.com', password: 'p' }),
    );
    expect(res.statusCode).toBe(409);
    expect(JSON.parse(res.body).message).toBe('Email already exists');
    expect(mockPutUser).not.toHaveBeenCalled();
  });

  it('creates user and returns 201 with token and user', async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    const res = await signupHandler(
      event({
        displayName: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
      }),
    );
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.token).toBe('mock-token');
    expect(body.user).toMatchObject({
      displayName: 'Alice',
      email: 'alice@example.com',
    });
    expect(body.user.id).toBeDefined();

    expect(mockHash).toHaveBeenCalledWith('secret', 10);
    expect(mockPutUser).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'Alice',
        email: 'alice@example.com',
        password: 'hashed-password',
      }),
    );
  });

  it('returns 500 on unexpected error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    mockGetUserByEmail.mockRejectedValue(new Error('DB error'));
    const res = await signupHandler(
      event({ displayName: 'A', email: 'a@b.com', password: 'p' }),
    );
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe('Internal server error');
    spy.mockRestore();
  });
});
