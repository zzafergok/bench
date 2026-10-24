'use client';

import * as React from 'react';
import type { AttachmentContextValue } from './types';

export const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: 'done',
  size: 'default',
  orientation: 'horizontal',
});

export function useAttachmentContext() {
  return React.useContext(AttachmentContext);
}
