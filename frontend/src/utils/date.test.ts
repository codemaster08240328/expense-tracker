import { describe, it, expect } from 'vitest';
import { localDateToISOString } from './date';

describe('localDateToISOString', () => {
  it('converts YYYY-MM-DD to ISO string at local midnight', () => {
    const result = localDateToISOString('2025-03-15');
    const d = new Date(result);
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(2); // March = 2
    expect(d.getDate()).toBe(15);
  });

  it('produces a valid ISO string', () => {
    const result = localDateToISOString('2025-01-01');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(() => new Date(result)).not.toThrow();
  });
});
