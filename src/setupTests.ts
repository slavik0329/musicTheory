// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock AudioContext globally for all tests
global.AudioContext = jest.fn().mockImplementation(() => ({
  createBufferSource: jest.fn(() => ({
    buffer: null,
    connect: jest.fn(),
    start: jest.fn(),
    playbackRate: { value: 1 },
  })),
  decodeAudioData: jest.fn().mockResolvedValue({}),
  destination: {},
})) as any;

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    ok: true,
  })
) as jest.Mock;
