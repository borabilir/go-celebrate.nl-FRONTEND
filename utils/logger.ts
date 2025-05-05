export function logWithContext(context: string, ...args: any[]) {
    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
      console.log(`[${context}]`, ...args);
    }
  }
  