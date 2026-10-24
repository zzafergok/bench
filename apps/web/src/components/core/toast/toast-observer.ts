import type { Toast } from '@/types';

export class ToastObserver {
  subscribers: Array<(toasts: Toast[]) => void> = [];
  toasts: Toast[] = [];

  subscribe = (subscriber: (toasts: Toast[]) => void) => {
    this.subscribers.push(subscriber);
    return () => {
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };

  publish = (data: Toast[]) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };

  addToast = (data: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toastItem = { id, ...data };
    this.toasts = [toastItem, ...this.toasts];
    this.publish(this.toasts);
    return id;
  };

  dismiss = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.publish(this.toasts);
  };

  info = (message: string, data?: Partial<Toast>) => {
    this.addToast({ title: message, ...data, type: 'info' });
  };

  success = (message: string, data?: Partial<Toast>) => {
    this.addToast({ title: message, ...data, type: 'success' });
  };

  error = (message: string, data?: Partial<Toast>) => {
    this.addToast({ title: message, ...data, type: 'error' });
  };

  loading = (message: string, data?: Partial<Toast>) => {
    return this.addToast({
      title: message,
      ...data,
      type: 'loading',
      duration: Infinity,
    });
  };
}

export const toast = new ToastObserver();
