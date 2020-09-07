import { Logger } from '.';

const loggerToConsoleOnly = new Logger();
// Standard error levels. Messages output with colorization.
loggerToConsoleOnly.debug('Greyed out timestamp to de-emphasize');
loggerToConsoleOnly.info('Variable number of arguments, not just', 1);
loggerToConsoleOnly.warn('Yellow for warnings');
loggerToConsoleOnly.error('Error with clean stack trace', new Error('Oops'));
loggerToConsoleOnly.info(['Arrays are logged', 'as JSON', 'with newlines if necessary']);

// Complex object
const graphqlError = [
  'Variable "$ID" is not defined.',
  'query ($id: ID!) {\n  product(id: $ID) {\n    id\n    name\n    description\n    time\n    imageUrl\n    tags\n    links {\n      text\n      url\n      __typename\n    }\n    __typename\n  }\n}\n',
  null,
  [
    {
      line: 2, column: 18,
    },
    {
      line: 1, column: 1,
    },
  ],
  {},
];

// Long JSON output is easy to read thanks to newlines
loggerToConsoleOnly.debug(graphqlError);

// Logging to file
const loggerToConsoleAndFile = new Logger('test.log');

const error = new Error('Unidentified flying error');
loggerToConsoleAndFile.error([1, true, 'Various types in the same array of messages', error]);
