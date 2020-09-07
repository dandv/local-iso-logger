# local-iso-logger — human-readable, clean timestamped output

[![Dependency Status](https://david-dm.org/dandv/local-iso-logger.svg)](https://david-dm.org/dandv/local-iso-logger) [![devDependency Status](https://david-dm.org/dandv/local-iso-logger/dev-status.svg)](https://david-dm.org/dandv/local-iso-logger#info=devDependencies)

Simple and to-the-point logger class outputting to the console and a file, with cleaned error stack traces. Uses four standard log levels: `debug`, `info`, `WARN`, `ERROR`.

![screenshot](https://user-images.githubusercontent.com/33569/92347070-a4884f00-f083-11ea-8bd6-c49a52fe4e50.png)

# Rationale

I wrote this module because [none of the existing logging packages on NPM](https://github.com/TomFrost/Bristol#why-another-logger) provides the features below. Most of my [efforts to use an existing library went to Bristol](https://github.com/TomFrost/Bristol/issues/created_by/dandv), which ended up being [abandoned](https://github.com/TomFrost/Bristol/issues/61).
 
# Features

+ prefixes each line with the local time in RFC3339 `YYYY-MM-DD HH:MM:SS` format (via [local-iso-dt](https://www.npmjs.com/package/local-iso-dt))

      [2020-09-06 17:00:00] It's tea time

+ outputs `Error` objects to file (via [serialize-error](https://www.npmjs.com/package/serialize-error))
+ cleans up `Error` stack traces (via [clean-stack](https://www.npmjs.com/package/clean-stack))
+ makes absolute error paths relative to the home directory
+ uses the native Node `console` with colorization, plus yellow for `WARN`s and red for `ERROR`s
  - the downside is that objects beyond 3 levels deep will be displayed as `[Object]`.
    Refer to the same timestamp in the log file to see the full JSON dump.
+ exposes a writable stream
+ you can use the familiar variable-arity `console` format:

  ```js
  import { Logger } from 'local-iso-logger';
  const logger = new Logger('file.log');
  logger.error('The value', value, 'is incorrect');  // "The value 42 is incorrect"
  ```

+ arrays are logged in JSON format, with newlines for readability

  ```js
  logger.error([error1, error2]);  // smart indented display
  ```


# Install

```sh
npm i local-iso-logger
```


# Usage

* TypeScript: `import { Logger } from 'local-iso-logger';`
* ES modules `.mjs` files: `import { Logger } from 'local-iso-logger/index.mjs';`
* Old school CommonJS:  `const { Logger } = require('local-iso-logger/index.js');

This is a [hybrid npm package](https://2ality.com/2019/10/hybrid-npm-packages.html) (created using variation 2.4.1 described on that page).


# Examples

```js
import { Logger } from 'local-iso-logger';
const logger = new Logger('file.log');

// Timestamp log messages in the YYYY-MM-DDTHH:MM:SS format and the local timezone
logger.debug('Greyed out timestamp to de-emphasize');
logger.info('Variable number of arguments, not just', 1);
logger.warn('Yellow for warnings');
logger.error('Error with clean stack trace', new Error('Oops'));
```

For more examples, see [examples.ts](example.ts).


# Known issues

Logging something right before calling `process.exit()` won't flush the output to the file. This is a problem with all loggers (e.g. [Winston](https://github.com/winstonjs/winston/issues/228), [Bristol](https://github.com/TomFrost/Bristol/issues/55)). As a workaround, try delaying the exit:

```js
setTimeout(() => process.exit(1),  1000);
```


# Author

[Dan Dascalescu](https://dandascalescu.com)


# License

MIT
