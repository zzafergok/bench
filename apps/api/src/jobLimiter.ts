import { ApiError } from './errors.js';

type Release = () => void;

type Waiter = {
  resolve: (release: Release) => void;
  reject: (error: ApiError) => void;
  timer: NodeJS.Timeout;
};

export class JobLimiter {
  private active = 0;
  private readonly queue: Waiter[] = [];

  constructor(
    public readonly maxConcurrent: number,
    public readonly maxQueued: number,
    private readonly queueTimeoutMs: number,
  ) {}

  get activeCount() {
    return this.active;
  }

  get queuedCount() {
    return this.queue.length;
  }

  async acquire(): Promise<Release> {
    if (this.active < this.maxConcurrent) {
      this.active += 1;
      return this.createRelease();
    }

    if (this.queue.length >= this.maxQueued) {
      throw new ApiError(
        503,
        'SERVER_BUSY',
        'Yerel işlem kuyruğu dolu. Lütfen mevcut işlemler tamamlandıktan sonra tekrar deneyin.',
      );
    }

    return new Promise<Release>((resolve, reject) => {
      const waiter: Waiter = {
        resolve,
        reject,
        timer: setTimeout(() => {
          const index = this.queue.indexOf(waiter);
          if (index >= 0) this.queue.splice(index, 1);
          reject(
            new ApiError(
              503,
              'JOB_QUEUE_TIMEOUT',
              'İşlem sırası bekleme süresini aştı. Lütfen tekrar deneyin.',
            ),
          );
        }, this.queueTimeoutMs),
      };
      this.queue.push(waiter);
    });
  }

  private createRelease(): Release {
    let released = false;
    return () => {
      if (released) return;
      released = true;

      const next = this.queue.shift();
      if (next) {
        clearTimeout(next.timer);
        next.resolve(this.createRelease());
        return;
      }
      this.active -= 1;
    };
  }
}
