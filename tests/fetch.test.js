import { fetchEventSource } from '../src/fetch.js';

describe('fetchEventSource', () => {
  beforeEach(() => {
    // 使用 jest-fetch-mock 模拟一个简单的 fetch 函数
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({
          'Content-Type': 'text/event-stream',
        }),
        body: new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode('data: {"message":"hello"}\n\ndata: {"message":"hello world"}\n\ndata: [DONE]'));
            controller.close();
          },
        }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test('fetchEventSource 接口应当处理的事件', async () => {
    const mockOnMessage = jest.fn();
    const mockOnOpen = jest.fn();
    const mockDone = jest.fn();
    const mockOnError = jest.fn();

    await fetchEventSource('/sse', {
      onmessage: mockOnMessage,
      onopen: mockOnOpen,
      done: mockDone,
      onerror: mockOnError,
    });

    expect(mockOnOpen).toHaveBeenCalled();

    /**
     * 测试 onMessage
     */
    // 根据 Stream 给定的数据，模拟函数应当被调用两次
    expect(mockOnMessage.mock.calls).toHaveLength(2);
    // 第一次调用时的参数
    expect(mockOnMessage.mock.calls[0][0]).toEqual(
      { data: { message: 'hello' } }
    );
    // 第二次调用时的参数
    expect(mockOnMessage.mock.calls[1][0]).toEqual(
      { data: { message: 'hello world' } }
    );

    expect(mockDone).toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });
});
