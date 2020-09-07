import { createWriteStream } from 'fs';
import { localISOdt } from 'local-iso-dt';
import * as cleanStack from 'clean-stack';
import { serializeError } from 'serialize-error';
import { Stream } from 'stream';

export function toJson(object, spaces = 2): string {
  return JSON.stringify(object, null, spaces);
}

// Look through all messages, identify any object with a `stack` property, and run cleanStack on it.
function recursivelyCleanStack(thing): string | void {
  if (!thing || thing instanceof Date)
    return;
  if (thing?.stack)
    try {
      return thing.stack = cleanStack(thing.stack, { pretty: true });
    } catch {
      return 'thing.stack was read-only';  // is the case for graphql errors
    }
  if (Array.isArray(thing))
    thing.forEach(e => recursivelyCleanStack(e));
  else if (thing instanceof Set || thing instanceof Map)
    // @ts-ignore
    for (const value of thing.values())
      cleanStack(value);
  else if (typeof thing === 'object')
    Object.values(thing).forEach(value => recursivelyCleanStack(value));
}

/**
 * Log messages to both the console and an optional file, with native console highlight and Error support.
 * Prefix each line with the current time expressed in the local timezone and ISO8601 format.
 */
export class Logger extends Stream.Writable {
  public stream;

  constructor(private readonly filename?: string) {
    super();
    // Create an append stream
    if (filename)
      this.stream = createWriteStream(filename, { flags:'a' });
  }

  static timestamp(): string {
    return `[${localISOdt().replace('T', ' ')}]`;
  }

  // Replace \n with newlines. Not called for console output, in order to preserve colorization.
  static message2json(potentialObject): (object | string) {
    if (typeof potentialObject === 'object')
      return toJson(serializeError(potentialObject), 4).replace(/\\n/g, '\n');
    if (typeof potentialObject === 'string')
      return potentialObject.replace(/\\n/g, '\n');
    return potentialObject;
  }

  // Format each message as JSON for file output. Remove any ANSI control sequences.
  static messages2json(messages): string {
    return messages.map(Logger.message2json).join(' ').replace(/\u001b\[\d\w/g, '');  // eslint-disable-line no-control-regex
  }

  // If the message starts with some newlines, move those *before* the timestamp, because the intent of the caller
  // was to have the newlines before the entire log line, not between the timestamp and their log messages.
  static prepareMessages(messages): string {
    // Clean error stack traces for both console and file output.
    recursivelyCleanStack(messages);
    let initialNewlines = '';
    try {
      initialNewlines = messages[0].match(/^\n+/)[0];
      messages[0] = messages[0].slice(initialNewlines.length);
    } catch { }  // eslint-disable-line no-empty
    return initialNewlines + Logger.timestamp();
  }

  debug(...messages): void {
    const prefix = Logger.prepareMessages(messages);
    // ANSI color codes from https://github.com/Marak/colors.js/blob/master/lib/styles.js
    console.debug(`\u001b[90m${prefix}\u001b[39m`, ...messages);
    this.stream?.write(`${prefix} debug: ${Logger.messages2json(messages)}\n`);
  }
  info(...messages): void {
    const prefix = Logger.prepareMessages(messages);
    console.info(prefix, ...messages);
    this.stream?.write(`${prefix} info: ${Logger.messages2json(messages)}\n`);
  }
  warn(...messages): void {
    const prefix = Logger.prepareMessages(messages);
    console.warn(`\u001b[33m${prefix} WARN:\u001b[39m`, ...messages);
    this.stream?.write(`${prefix} WARN: ${Logger.messages2json(messages)}\n`);
  }
  error(...messages): void {
    const prefix = Logger.prepareMessages(messages);
    console.error(`\u001b[31m${prefix} ERROR:\u001b[39m`, ...messages);
    this.stream?.write(`${prefix} ERROR: ${Logger.messages2json(messages)}\n`);
  }

  // Support being used as a writable stream
  write(message): boolean {
    const prefix = Logger.prepareMessages([message]);
    console.debug(prefix, message);
    this.stream?.write(`${prefix} debug: ${Logger.message2json(message)}\n`);
    return true;
  }

  teardown(): void {
    this.stream?.end();
  }
}
