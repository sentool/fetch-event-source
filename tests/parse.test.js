import eventsourceParser from '../src/parse.js';

describe('eventsourceParser', () => {
  test('默认应当自动解析 SSE 的 JSON 数据', () => {
    const data = 'data: {"message":"hello"}\n\n';
    const mockCallback = jest.fn();

    eventsourceParser(data, mockCallback, { parseJson: true });

    expect(mockCallback).toHaveBeenCalledWith(
      { data: { message: 'hello' } }
    );
  });

  test('Steeam Event 返回不完整数据时的缓冲', () => {
    const data = [
      'data: {"message":"hello"}\n\n',
      'data: {"messag',
      'e":"hello world"}\n\n'
    ];
    const mockCallback = jest.fn();
    const instance = {};

    data.forEach(item => {
      eventsourceParser(item, mockCallback, { instance, parseJson: true });
    });

    expect(mockCallback).toHaveBeenCalledWith(
      { data: { message: 'hello world' } }
    );
  });

  test('如果 parseJson: false，则不应该解析 JSON', () => {
    const data = 'data: {"message":"hello"}\n\n';
    const mockCallback = jest.fn();

    eventsourceParser(data, mockCallback, { parseJson: false });

    expect(mockCallback).toHaveBeenCalledWith(
      { data: '{"message":"hello"}' }
    );
  });
});
