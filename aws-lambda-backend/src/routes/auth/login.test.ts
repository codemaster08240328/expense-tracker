import { loginHandler } from './login';
import { getUserByEmail } from '@services/auth/userService';
import { compare } from 'bcryptjs';

jest.mock('@services/auth/userService', () => ({
  getUserByEmail: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<
  typeof getUserByEmail
>;
const mockCompare = compare as jest.MockedFunction<typeof compare>;

function event(body: object): any {
  return {
    body: JSON.stringify(body),
    headers: {},
  };
}

describe('loginHandler', () => {
  beforeEach(() => {
    mockGetUserByEmail.mockReset();
    mockCompare.mockReset();
  });

  it('returns 400 when email is missing', async () => {
    const res = await loginHandler(event({ password: 'p' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe('Missing fields');
    expect(mockGetUserByEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when password is missing', async () => {
    const res = await loginHandler(event({ email: 'a@b.com' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe('Missing fields');
    expect(mockGetUserByEmail).not.toHaveBeenCalled();
  });

  it('returns 401 when user not found', async () => {
    mockGetUserByEmail.mockResolvedValue(null);
    const res = await loginHandler(event({ email: 'a@b.com', password: 'p' }));
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body).message).toBe('Invalid credentials');
    expect(mockCompare).not.toHaveBeenCalled();
  });

  it('returns 401 when password does not match', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: 'u1',
      displayName: 'User',
      email: 'a@b.com',
      password: 'hashed',
    });
    (mockCompare as jest.Mock).mockResolvedValue(false);
    const res = await loginHandler(event({ email: 'a@b.com', password: 'wrong' }));
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body).message).toBe('Invalid credentials');
    expect(mockCompare).toHaveBeenCalledWith('wrong', 'hashed');
  });

  it('returns 200 with token and user when credentials valid', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: 'u1',
      displayName: 'Alice',
      email: 'a@b.com',
      password: 'hashed',
    });
    (mockCompare as jest.Mock).mockResolvedValue(true);
    const res = await loginHandler(event({ email: 'a@b.com', password: 'secret' }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBe('mock-token');
    expect(body.user).toEqual({
      id: 'u1',
      displayName: 'Alice',
      email: 'a@b.com',
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockGetUserByEmail.mockRejectedValue(new Error('DB error'));
    const res = await loginHandler(event({ email: 'a@b.com', password: 'p' }));
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe('Internal server error');
  });
});
