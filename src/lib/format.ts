export function gtFormatMoney(n: number): string {
  return 'RM ' + Number(n).toLocaleString('en-MY', { minimumFractionDigits: 0 });
}

export function gtFormatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function gtFormatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
}

export function gtNextRef(existingIds: string[]): string {
  const nums = existingIds.map((id) => parseInt(id.replace('GT-', ''), 10) || 0);
  const next = (Math.max(0, ...nums) + 1).toString().padStart(4, '0');
  return 'GT-' + next;
}
