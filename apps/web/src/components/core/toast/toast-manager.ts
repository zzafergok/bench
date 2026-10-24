import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react';

const baseManager = BaseToast.createToastManager();

export const toast = Object.assign(baseManager, {
  success: (
    title: React.ReactNode,
    options?: Partial<Parameters<typeof baseManager.add>[0]>,
  ) => baseManager.add({ title, type: 'success', ...options }),
  error: (
    title: React.ReactNode,
    options?: Partial<Parameters<typeof baseManager.add>[0]>,
  ) => baseManager.add({ title, type: 'error', ...options }),
  warning: (
    title: React.ReactNode,
    options?: Partial<Parameters<typeof baseManager.add>[0]>,
  ) => baseManager.add({ title, type: 'warning', ...options }),
  info: (
    title: React.ReactNode,
    options?: Partial<Parameters<typeof baseManager.add>[0]>,
  ) => baseManager.add({ title, type: 'info', ...options }),
  loading: (
    title: React.ReactNode,
    options?: Partial<Parameters<typeof baseManager.add>[0]>,
  ) => baseManager.add({ title, type: 'loading', timeout: 0, ...options }),
  dismiss: (id?: string) => baseManager.close(id),
});
