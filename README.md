English · [中文](./README.zh-CN.md)

[npm]: https://img.shields.io/npm/v/@sentool/fetch-event-source
[npm-url]: https://www.npmjs.com/package/@sentool/fetch-event-source
[size]: https://packagephobia.now.sh/badge?p=@sentool/fetch-event-source
[size-url]: https://packagephobia.now.sh/result?p=@sentool/fetch-event-source

[![npm][npm]][npm-url] [![size][size]][size-url]

# @sentool/fetch-event-source

Using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to request an SSE (Server-Sent Events) endpoint. It is a refactoring of `@microsoft/fetch-event-source`, with a more concise code implementation, and it supports use in both Node.js and browser environments.

## Install

```bash
npm install @sentool/fetch-event-source
```

## Usage

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

You can also use a CDN to include it.

```js
<script src="https://unpkg.com/@sentool/fetch-event-source/dist/index.min.js"></script>
<script type="module">
  const { fetchEventSource } = FetchEventSource;
  fetchEventSource(url, options);
</script>
```

You can abort the request at any time within any event, for example:

```js
const eventSource = await fetchEventSource(url, options);

// Assume the request is aborted after 3 seconds
setTimeout(() => {
  eventSource.abort();
}, 3000);
```

### Options

In addition to [the options available](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) in the Fetch API, the following extra options have been added:

| option | type | description |
| --- | --- | --- |
| `onOpen` | function | Call when the request has been opened. |
| `onMessage` | function | Call when data is received function an event source. |
| `onError` | function | Call when an error occurs. |
| `done` | function | Call when the stream has completed. |
| `parseJson` | boolean | Whether to parse the response as JSON. Defaults to `true`. |

## License

MIT © [sentool](https://github.com/sentool)
