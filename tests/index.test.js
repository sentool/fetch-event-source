import * as index from '../src/index.js';
import { fetchEventSource, eventsourceParser } from '../src/fetch.js';

describe('index.js exports', () => {
  test('export fetchEventSource from fetch.js', () => {
    expect(index.fetchEventSource).toBe(fetchEventSource);
  });
  test('export eventsourceParser from parse.js', () => {
    expect(index.eventsourceParser).toBe(eventsourceParser);
  });
});
