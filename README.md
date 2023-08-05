# Messari Client

A Node.js client for fetching cryptocurrency data from **[Messari API](https://messari.io/dashboard)**, which provides crypto research, data and tools.

## Autores

- **[Matheus Torres](https://www.github.com/matheustrres)**

## Features

- Search for basic metadata of an asset
- Search for all quantitative metrics of an asset
- Search for the latest market-data for an asset
- List of all exchanges and pairs supported
- List of all assets and their metrics
- List of the latest news and analysis for an asset
- List of the latest news and analysis for all assets

## Installation

Install the npm package

```bash
npm install @matheustrres/messari-client --save
```
    
## Quick Start

- Initialize the client by providing a valid api key

```typescript
import { MessariClient } from '@matheustrres/messari-client'

export const messariClient = new MessariClient({
  key: 'valid-messari-api-key',
});

```

All client methods will return an object containing `status` and `data`. To ensure any mistakes, check the value of the `status.error_code` or `status.error_message` properties before making use of `data` properties, if they are filled this indicates that there was an error in the request and `data` will be undefined.

#### - Search for basic metadata of an asset

```typescript
const { status, data } = await messariClient.getAsset('bitcoin');

if (status.error_code || status.error_message) {
  // An error has been found while searching, 
  // data will be undefined
}

console.log(data);
```
## License

This project is **[MIT](https://github.com/matheustrres/messari-client/blob/main/LICENSE)** licensed.