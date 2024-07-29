## Fetch Event Source
Using the Fetch API to request an SSE (Server-Sent Events) endpoint.

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

## License
MIT
