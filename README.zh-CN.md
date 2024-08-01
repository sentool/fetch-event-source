[English](./README.md) · 中文

[npm]: https://img.shields.io/npm/v/@sentool/fetch-event-source
[npm-url]: https://www.npmjs.com/package/@sentool/fetch-event-source
[size]: https://packagephobia.now.sh/badge?p=@sentool/fetch-event-source
[size-url]: https://packagephobia.now.sh/result?p=@sentool/fetch-event-source

[![npm][npm]][npm-url] [![size][size]][size-url]

# @sentool/fetch-event-source

使用 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求 SSE（Server-Sent Events）端点。它是对 `@microsoft/fetch-event-source` 项目的重构，代码实现得更为简练，支持在 Node.js 和浏览器中使用。

## 安装

```bash
npm install @sentool/fetch-event-source
```

## 使用

```js
import { fetchEventSource } from '@sentool/fetch-event-source';

await fetchEventSource('/api/sse', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>",
  },
  body: JSON.stringify({
    input: ""
  }),
  onopen(response) {
    console.log('Request has been opened.');
  },
  onmessage(event) {
    console.log(event);
  },
  onerror(error) {
    console.error(error);
  },
  done() {
    console.log('Stream has completed.');
  },
});
```

或在浏览器中通过 CDN 的方式引入

```js
<script src="https://unpkg.com/@sentool/fetch-event-source/dist/index.min.js"></script>
<script type="module">
  const { fetchEventSource } = FetchEventSource;
  fetchEventSource(url, options);
</script>
```

你可以在任意事件中随时中止请求，如:

```js
const eventSource = await fetchEventSource(url, options);

// 这里假设在 3 秒后中止
setTimeout(() => {
  eventSource.abort();
}, 3000);
```

### Options

除了支持 Fetch API 自带的 [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) 选项外，我们还添加了以下选项：


| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `onopen` | function | 请求成功打开后触发 |
| `onmessage` | function | 接受到事件流数据时触发。 |
| `onerror` | function | 出错时触发 |
| `done` | function | 事件流完成后触发 |
| `parseJson` | boolean | 是否自动解析响应数据中的 JSON 字符。默认 `true` |

## License

MIT © [sentool](https://github.com/sentool)
