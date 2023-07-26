
# Messari Client

A Node.js client for interacting with the **[Messari API](http://messari.io)**, which provides crypto research, data and tools.

## Installation

You can install the latest version of the client using:

```bash
$ npm install @matheustrres/messari-client
$ yarn add @matheustrres/messari-client
```
    
## Getting Started

```javascript
import { MessariClient } from '@matheustrres/messari-client';

(async () => {
  const client = new MessariClient({
    key: 'valid-messari-api-key',
  });
  const { data, status } = await client.getAsset('ethereum');

  if (status.error_message) {
    // An error has been found
    // asset.data will be undefined
  }

  const ethId = data.id;
  const ethName = data.name;
  const ethSymbol = data.symbol;

  // ... 
})();
```


## License

This project is **[MIT licensed](https://github.com/matheustrres/messari-client/blob/main/LICENSE)**.

