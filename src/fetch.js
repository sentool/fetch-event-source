import eventsourceParser from './parse.js';

class FetchEventSource {
  constructor() {
    this.controller = new AbortController();
  }

  /**
   * 发起请求
   * @param {string} url
   * @param {Object} options
   */
  async fetch( url, options = {} ) {
    const {
      headers,
      signal = this.controller.signal,
      parseJson = true
    } = options;

    // 默认 headers
    options.headers = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      ...headers,
    };

    try {
      const response = await fetch(url, {
        signal,
        ...options,
      });

      await options.onopen?.(response);

      // 响应异常
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        const ACCEPT = options.headers['Accept'];
        if (!String(contentType).startsWith(ACCEPT)) {
          console.error(`Expected content-type to be ${ACCEPT}, Actual: ${contentType}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      // 读取流
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      async function readStream() {
        const { done, value } = await reader.read();

        // DONE
        if (done) return options.done?.(response);

        const chunk = decoder.decode(value); // 解码 Uint8Array
        eventsourceParser(chunk, options.onmessage, { instance: this, parseJson }); // 解析 SSE 数据格式

        await readStream();
      }
      await readStream();
    } catch(error) {
      this.abort();
      delete this.buffer;
      options.onerror?.(error);
    }
  }

  // 中断请求
  abort() {
    this.controller.abort();
  }
}

// 创建实例
export async function fetchEventSource(...args) {
  const eventSource = new FetchEventSource();
  await eventSource.fetch(...args);
  return eventSource;
};

export { eventsourceParser };
