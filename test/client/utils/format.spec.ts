import { formatUSD } from 'src/client/utils/format';

describe('formatUSD', () => {
  it('formats a value representing a monetary amount', () => {
    expect(formatUSD(123)).toBe('$123');
    expect(formatUSD(1234)).toBe('$1,234');
    expect(formatUSD(12345)).toBe('$12,345');
    expect(formatUSD(123456)).toBe('$123,456');
    expect(formatUSD(1234567890)).toBe('$1,234,567,890');
  });
});
