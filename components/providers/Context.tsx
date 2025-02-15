'use client';

/**
 * Read more: https://jotai.org/docs/guides/migrating-to-v2-api#previous-api
 */

import { Provider } from 'jotai';

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
