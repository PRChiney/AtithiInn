// src/setupTests.js
import '@testing-library/jest-dom'; // for extended DOM assertions
import { server } from './mocks/server'; // If you're using MSW (Mock Service Worker) for API mocking

// Set up a mock service worker (MSW) to handle API mocking if needed
beforeAll(() => {
  server.listen(); // Start the server to intercept API requests
});

afterEach(() => {
  server.resetHandlers(); // Reset any runtime request handlers after each test
});

afterAll(() => {
  server.close(); // Clean up after all tests are done
});
