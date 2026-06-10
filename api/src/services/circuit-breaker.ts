type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenRequests?: number;
}

interface CircuitStats {
  failures: number;
  successes: number;
  state: CircuitState;
  lastFailure: Date | null;
  nextReset: Date | null;
}

interface CircuitBreakerInstance {
  execute<T>(fn: () => Promise<T>): Promise<T>;
  getState(): CircuitState;
  getStats(): CircuitStats;
  reset(): void;
}

const createCircuitBreaker = (
  options: CircuitBreakerOptions = {},
): CircuitBreakerInstance => {
  let state: CircuitState = 'CLOSED';
  let failures = 0;
  let successes = 0;
  let lastFailure: Date | null = null;
  let nextReset: Date | null = null;
  let halfOpenCount = 0;

  const failureThreshold = options.failureThreshold ?? 5;
  const resetTimeout = options.resetTimeout ?? 60000;
  const halfOpenRequests = options.halfOpenRequests ?? 3;

  const shouldAttemptReset = (): boolean => {
    return nextReset !== null && Date.now() >= nextReset.getTime();
  };

  const onSuccess = (): void => {
    failures = 0;

    if (state === 'HALF_OPEN') {
      successes++;
      if (successes >= halfOpenRequests) {
        state = 'CLOSED';
        successes = 0;
        nextReset = null;
      }
    }
  };

  const onFailure = (): void => {
    failures++;
    lastFailure = new Date();

    if (state === 'HALF_OPEN' || failures >= failureThreshold) {
      state = 'OPEN';
      nextReset = new Date(Date.now() + resetTimeout);
    }
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (state === 'OPEN') {
      if (shouldAttemptReset()) {
        state = 'HALF_OPEN';
        halfOpenCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      onSuccess();
      return result;
    } catch (error) {
      onFailure();
      throw error;
    }
  };

  const getState = (): CircuitState => state;

  const getStats = (): CircuitStats => ({
    failures,
    successes,
    state,
    lastFailure,
    nextReset,
  });

  const reset = (): void => {
    state = 'CLOSED';
    failures = 0;
    successes = 0;
    lastFailure = null;
    nextReset = null;
    halfOpenCount = 0;
  };

  return {
    execute,
    getState,
    getStats,
    reset,
  };
};

export const stripeCircuitBreaker = createCircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  halfOpenRequests: 2,
});

export const emailCircuitBreaker = createCircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  halfOpenRequests: 3,
});

export {
  createCircuitBreaker,
  type CircuitBreakerInstance,
  type CircuitStats,
  type CircuitState,
};
