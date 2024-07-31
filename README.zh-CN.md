[English](./README.md) · 中文

# @sentool/fetch-event-source

使用 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求 SSE（Server-Sent Events）端点。它是对 `@microsoft/fetch-event-source` 的重构，代码实现得更为简练，支持在 Node.js 和浏览器中使用。

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
  onOpen(response) {
    console.log('Request has been opened.');
  },
  onMessage(event) {
    console.log(event);
  },
  onError(error) {
    console.error(error);
  },
  done() {
    console.log('Stream has completed.');
  },
});
```

你也可以在浏览器中通过 CDN 的方式引入

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
| `onOpen` | function | 请求成功打开后触发 |
| `onMessage` | function | 接受到事件流数据时触发。 |
| `onError` | function | 出错时触发 |
| `done` | function | 事件流完成后触发 |
| `parseJson` | boolean | 是否自动解析响应数据中的 JSON 字符。默认 `true` |

## License

MIT © [sentool](https://github.com/sentool)
