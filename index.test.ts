import { Logger } from '.';

test('array', () => {
  const messages = [
    [
      'Variable "$ID" is not defined.',
      'query ($id: ID!) {\n  discussion(id: $ID) {\n    id\n    topic\n    motivation\n    time\n    imageUrl\n    anchor {\n      id\n      username\n      name\n      __typename\n    }\n    anonymous\n    priorKnowledgeRequired\n    tags\n    instructions\n    questions\n    links {\n      text\n      url\n      __typename\n    }\n    signedUp {\n      signUpTime\n      civilian {\n        name\n        email\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
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
    ],
  ];

  const prefix = Logger.prepareMessages(messages);
  expect(prefix).toMatch(/\[\d{4}-\d\d-\d\d \d\d:\d\d:\d\d]/);
});
