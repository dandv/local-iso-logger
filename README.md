# local-iso-logger — human-readable, clean timestamped output

[![Dependency Status](https://david-dm.org/dandv/local-iso-logger.svg)](https://david-dm.org/dandv/local-iso-logger) [![devDependency Status](https://david-dm.org/dandv/local-iso-logger/dev-status.svg)](https://david-dm.org/dandv/local-iso-logger#info=devDependencies)

Simple and to-the-point logger class outputting to the console and optionally to a file, with cleaned error stack traces. Uses four standard log levels: `debug`, `info`, `WARN`, `ERROR`.

![screenshot](https://user-images.githubusercontent.com/33569/92347070-a4884f00-f083-11ea-8bd6-c49a52fe4e50.png)


# Rationale

I wrote this minimalistic module because [none of the existing logging packages on NPM](https://github.com/TomFrost/Bristol#why-another-logger) provides the features below. Most of my [efforts to use an existing library went to Bristol](https://github.com/TomFrost/Bristol/issues/created_by/dandv), which ended up being [abandoned](https://github.com/TomFrost/Bristol/issues/61).

 
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
+ you can use the familiar variable-arity `console` format, with arguments of any type:

  ```js
  logger.warn('Got', results.length, 'results, but also an error:', results, new Error('oops'));
  ```

+ arrays are logged in JSON format, with newlines for readability

  ```js
  logger.error([error1, error2]);  // smart indented display
  ```


# Install

```sh
npm i local-iso-logger
```


# Importing

* TypeScript: `import { Logger } from 'local-iso-logger';`
* ES modules `.mjs` files: `import { Logger } from 'local-iso-logger/index.mjs';`
* Old school CommonJS:  `const { Logger } = require('local-iso-logger/index.js')`;

This is a [hybrid npm package](https://2ality.com/2019/10/hybrid-npm-packages.html) (created using variation 2.4.1 described on that page), with [conditional exports](https://nodejs.org/api/esm.html#esm_conditional_exports) that enable named imports even from TypeScript code generating ES Modules, which would otherwise [only](https://github.com/apollographql/apollo-server/issues/1356#issuecomment-681313954) support [default (not named) imports from the CommonJS](https://stackoverflow.com/questions/61549406/how-to-include-commonjs-module-in-es6-module-node-app) target of this package ([TypeScript doesn't support .mjs input files](https://github.com/microsoft/TypeScript/issues/27957)).


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


# Methods

## new Logger(filename?: string)

Constructor that takes an optional filename argument. If passed, it will create a `.stream` instance member, which is an append [writable stream](https://nodejs.org/api/stream.html#stream_writable_streams). You can pass the stream to other modules, for example to [set up debugging with Mongoose](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-set):

```js
const logger = new Logger('file.log');
mongoose.set('debug', logger.stream);
```

All methods log to the console, and if a filename was passed to the constructor, to that file as well. The file will contain full JSON object dumps, while the console output will only introspect objects 3 levels deep. Both the console and the file output start with the local time in RFC3339 `[YYYY-MM-DD HH:MM:SS]` format (via [local-iso-dt](https://www.npmjs.com/package/local-iso-dt))

## debug(...messages)

Log in grey color to the console, and with the `debug` prefix to the file.


## info(...messages)

Log in normal color to the console (via `console.info`), and with the `info` prefix to the file.


## warn(...messages)

Log to the console via `console.warn`, and with the `WARN` prefix to both the console and the file.


## error(...messages)

Log to the console via `console.error`, and with the `ERROR` prefix to both the console and the file.


## write(message)

Write to the stream directly, with the `debug` prefix. Also passes the message to `console.debug`, in normal color.


## Logger.timestamp(datetime?): string

Static method that returns the timestamp prefix in RFC3339 `[YYYY-MM-DD HH:MM:SS]` format. The `datetime` parameter is optional and defaults to the current time. It is passed unchanged to [local-iso-dt](https://www.npmjs.com/package/local-iso-dt).


## localISOdt(datetime?): string

Re-export of [local-iso-dt](https://www.npmjs.com/package/local-iso-dt). 


## teardown()

Closes the stream.


# Known issues

Logging something right before calling `process.exit()` won't flush the output to the file. This is a problem with all loggers (e.g. [Winston](https://github.com/winstonjs/winston/issues/228), [Bristol](https://github.com/TomFrost/Bristol/issues/55)). As a workaround, try delaying the exit:

```js
setTimeout(() => process.exit(1),  1000);
```


# Author

[Dan Dascalescu](https://dandascalescu.com)


# License

MIT
