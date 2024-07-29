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
        } catch(e) {}
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
          default: // id, event, retry
            message[field] = /^\d+$/.test(value) ? parseInt(value) : value;
        }
      }
    }
  });
};

export default eventsourceParser;
