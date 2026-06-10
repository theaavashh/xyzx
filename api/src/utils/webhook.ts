import { logger } from './logger';

const WEB_BASE_URL = process.env.WEB_BASE_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'rapharch-revalidate-secret';

export async function triggerRevalidation(tag: string): Promise<void> {
  try {
    const url = `${WEB_BASE_URL}/api/revalidate`;
    logger.debug('Triggering revalidation', { tag, url });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, secret: REVALIDATE_SECRET }),
    });

    const result = await response.json();

    if (response.ok) {
      logger.info('Revalidation succeeded', { tag });
    } else {
      logger.warn('Revalidation failed', { tag, status: response.status });
    }
  } catch (err) {
    logger.error('Revalidation error', { tag }, err as Error);
  }
}
