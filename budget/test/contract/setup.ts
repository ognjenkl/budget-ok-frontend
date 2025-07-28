import { setupServer } from 'msw/node';
import { afterEach, beforeAll, afterAll } from 'vitest';

export const server = setupServer();

beforeAll(() => {
  // For contract tests, we want to bypass unhandled requests to allow Pact mock server to work
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
