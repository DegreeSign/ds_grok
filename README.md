# DegreeSign Grok AI SDK
A lightweight TypeScript package for accessing Grok APIs.

## Setup

Install the package

### npm
```bash
npm install @degreesign/grok
```

### yarn
```bash
yarn add @degreesign/grok
```

## Usage

### CDN (direct web implementation)
Use in browsers through CDN
```html
<script 
    src="https://cdn.jsdelivr.net/npm/@degreesign/grok@1.0.2/dist/browser/degreesign.min.js"
></script>
```
Note `dsGrok` is the browser global object for this library functions.

### Node.js
Import the functions from the `@degreesign/grok` package in your TypeScript or JavaScript project:
```ts
import { grokAI } from '@degreesign/grok';

grokAI({
    apiKey: `123456789`,
    responseType: `json`,
    prompt: [{
        dataKeyName: `randomNumber`,
        type: `number`;
        requiredData: `a random number value`,
    },{
        dataKeyName: `coinFlip`,
        type: `boolean`;
        requiredData: `true or false value`,
    }],
});
```

Below are the available functions and their usage examples.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request at [https://github.com/DegreeSign/ds_grok](https://github.com/DegreeSign/ds_grok).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DegreeSign/ds_grok/blob/main/LICENSE) file for details.