export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;

  const firstChar = local.slice(0, 3);
  const masked = firstChar + '*'.repeat(Math.max(local.length - firstChar.length, 3));

  return `${masked}@${domain}`;
}
