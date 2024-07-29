/**
 * SSE 文本解析
 * @param {string} chunk - decode 后的 SSE 格式数据块
 * @param {Function} callback
 * @param {Object} instance
 */
function eventsourceParser(chunk, callback, options = {}) {
  let message = {};
  const {
    instance = eventsourceParser,
    parseJson = true
  } = options;
  const buffer = (instance.buffer || '') + chunk;
  const lines = buffer.split('\n');

  // SSE 规范要求每个事件使用空行即 \n\n 进行分割
  // 移除最后一行，若事件完整则为空行，若事件不完整则留作下次处理
  instance.buffer = lines.pop();

  // 解析原始数据
  lines.forEach((item, index) => {
    // 空行表示一个完整事件的结束
    if (item.trim() === '') {
      // 是否自动解析 JSON
      if (parseJson) {
        try {
          message.data = JSON.parse(message.data);
        } catch (e) {}
      }
      callback?.(message, index); // 返回数据
      message = {}; // 重置事件返回的数据
    } else {
      const fieleLength = item.indexOf(':');
      const field = item.substring(0, fieleLength);
      const value = item.substring(fieleLength + 1);

      // 处理数据
      if (field.trim()) {
        switch (field) {
          case 'data':
            message.data = value;
            break;
          default:
            // id, event, retry
            message[field] = /^\d+$/.test(value) ? parseInt(value) : value;
        }
      }
    }
  });
}

class FetchEventSource {
  constructor() {
    this.controller = new AbortController();
  }

  /**
   * 发起请求
   * @param {string} url
   * @param {Object} options
   */
  async fetch(url, options = {}) {
    const {
      headers,
      signal = this.controller.signal,
      parseJson = true
    } = options;

    // 默认 headers
    options.headers = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      ...headers
    };
    try {
      const response = await fetch(url, {
        signal,
        ...options
      });

      // 响应异常
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        const ACCEPT = options.headers['Accept'];
        if (!String(contentType).startsWith(ACCEPT)) {
          console.error(`Expected content-type to be ${ACCEPT}, Actual: ${contentType}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }
      options.onOpen?.(response);

      // 读取流
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      async function readStream() {
        const {
          done,
          value
        } = await reader.read();

        // DONE
        if (done) return options.done?.(response);
        const chunk = decoder.decode(value); // 解码 Uint8Array
        eventsourceParser(chunk, options.onMessage, {
          instance: this,
          parseJson
        }); // 解析 SSE 数据格式

        readStream();
      }
      readStream();
    } catch (error) {
      this.abort();
      delete this.buffer;
      options.onError?.(error);
    }
  }

  // 中断请求
  abort() {
    this.controller.abort();
  }
}

// 创建实例
async function fetchEventSource(...args) {
  const eventSource = new FetchEventSource();
  await eventSource.fetch(...args);
  return eventSource;
}

export { eventsourceParser, fetchEventSource };
//# sourceMappingURL=index.esm.js.map
