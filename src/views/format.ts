// Shared formatting helpers for the webview panels.

export function severityLabel(n: number): string {
  if (n >= 21) return 'FATAL';
  if (n >= 17) return 'ERROR';
  if (n >= 13) return 'WARN';
  if (n >= 9) return 'INFO';
  if (n >= 5) return 'DEBUG';
  if (n >= 1) return 'TRACE';
  return '';
}

export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
}

export function formatTimestamp(ms: number, useLocalTime: boolean): string {
  const date = new Date(ms);
  const get = (local: () => number, utc: () => number): number => (useLocalTime ? local() : utc());
  const pad = (n: number, width = 2): string => String(n).padStart(width, '0');
  const offset = useLocalTime ? -date.getTimezoneOffset() : 0;
  const zone = useLocalTime
    ? `${offset < 0 ? '-' : '+'}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
    : 'Z';

  return (
    `${pad(get(() => date.getFullYear(), () => date.getUTCFullYear()), 4)}-` +
    `${pad(get(() => date.getMonth() + 1, () => date.getUTCMonth() + 1))}-` +
    `${pad(get(() => date.getDate(), () => date.getUTCDate()))}T` +
    `${pad(get(() => date.getHours(), () => date.getUTCHours()))}:` +
    `${pad(get(() => date.getMinutes(), () => date.getUTCMinutes()))}:` +
    `${pad(get(() => date.getSeconds(), () => date.getUTCSeconds()))}.` +
    `${pad(date.getMilliseconds(), 3)}${zone}`
  );
}

export function formatChartTime(ms: number, useLocalTime: boolean, includeDate: boolean): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeDate ? { month: 'short', day: 'numeric' } : {}),
    ...(!useLocalTime ? { timeZone: 'UTC' } : {}),
  };
  return new Intl.DateTimeFormat(undefined, options).format(new Date(ms));
}

export function shortId(id: string, len = 8): string {
  return id.length > len ? id.slice(0, len) : id;
}
