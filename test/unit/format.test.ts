import * as assert from 'assert';
import { formatChartTime, formatTimestamp } from '../../src/views/format';

describe('timestamp formatting', () => {
  it('formats UTC timestamps as ISO strings', () => {
    assert.strictEqual(formatTimestamp(0, false), '1970-01-01T00:00:00.000Z');
  });

  it('formats local timestamps with their numeric UTC offset', () => {
    const date = new Date(0);
    const offset = -date.getTimezoneOffset();
    const sign = offset < 0 ? '-' : '+';
    const pad = (value: number) => String(value).padStart(2, '0');
    const expected =
      `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.000` +
      `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
    assert.strictEqual(formatTimestamp(0, true), expected);
  });

  it('uses UTC for metric chart labels when local time is disabled', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(0));
    assert.strictEqual(formatChartTime(0, false, false), expected);
  });
});