import { describe, expect, it } from 'vitest';
import { JobLimiter } from '../src/jobLimiter.js';

describe('JobLimiter', () => {
  it('runs only the configured number of jobs and hands the slot to the queue', async () => {
    const limiter = new JobLimiter(1, 1, 1_000);
    const releaseFirst = await limiter.acquire();
    const second = limiter.acquire();

    expect(limiter.activeCount).toBe(1);
    expect(limiter.queuedCount).toBe(1);
    await expect(limiter.acquire()).rejects.toMatchObject({
      code: 'SERVER_BUSY',
    });

    releaseFirst();
    const releaseSecond = await second;
    expect(limiter.activeCount).toBe(1);
    expect(limiter.queuedCount).toBe(0);
    releaseSecond();
    expect(limiter.activeCount).toBe(0);
  });

  it('removes jobs that exceed the queue wait timeout', async () => {
    const limiter = new JobLimiter(1, 1, 5);
    const release = await limiter.acquire();
    await expect(limiter.acquire()).rejects.toMatchObject({
      code: 'JOB_QUEUE_TIMEOUT',
    });
    expect(limiter.queuedCount).toBe(0);
    release();
  });
});
