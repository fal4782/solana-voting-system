export type VotingContract = {
  version: "0.1.0";
  name: "voting_contract";
  instructions: [
    {
      name: "createPoll";
      accounts: [
        {
          name: "pollData";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "arg";
                type: "string";
                path: "poll_title";
              }
            ];
          };
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "pollTitle";
          type: "string";
        },
        {
          name: "options";
          type: {
            vec: "string";
          };
        },
        {
          name: "expiration";
          type: "i64";
        }
      ];
    },
    {
      name: "vote";
      accounts: [
        {
          name: "pollData";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "arg";
                type: "string";
                path: "poll_title";
              }
            ];
          };
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "pollTitle";
          type: "string";
        },
        {
          name: "candidateIndex";
          type: "u16";
        }
      ];
    },
    {
      name: "endPoll";
      accounts: [
        {
          name: "pollData";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "arg";
                type: "string";
                path: "poll_title";
              }
            ];
          };
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "pollTitle";
          type: "string";
        }
      ];
    },
    {
      name: "getResults";
      accounts: [
        {
          name: "pollData";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "arg";
                type: "string";
                path: "poll_title";
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "pollTitle";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "pollData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pollCreator";
            type: "publicKey";
          },
          {
            name: "pollTitle";
            type: "string";
          },
          {
            name: "options";
            type: {
              vec: "string";
            };
          },
          {
            name: "voteCounts";
            type: {
              vec: "u64";
            };
          },
          {
            name: "expiration";
            type: "i64";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "CannotVoteOnOwnPoll";
      msg: "Cannot vote on your own poll";
    },
    {
      code: 6001;
      name: "PollNotActive";
      msg: "Poll is not active or has expired";
    },
    {
      code: 6002;
      name: "InvalidCandidate";
      msg: "Invalid candidate index";
    },
    {
      code: 6003;
      name: "NotPollCreator";
      msg: "Only the poll creator can end the poll";
    },
    {
      code: 6004;
      name: "PollAlreadyEnded";
      msg: "Poll has already ended";
    },
    {
      code: 6005;
      name: "PollNotEnded";
      msg: "Poll is still active";
    }
  ];
};

export const IDL: VotingContract = {
  version: "0.1.0",
  name: "voting_contract",
  instructions: [
    {
      name: "createPoll",
      accounts: [
        {
          name: "pollData",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "arg",
                type: "string",
                path: "poll_title",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "pollTitle",
          type: "string",
        },
        {
          name: "options",
          type: {
            vec: "string",
          },
        },
        {
          name: "expiration",
          type: "i64",
        },
      ],
    },
    {
      name: "vote",
      accounts: [
        {
          name: "pollData",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "arg",
                type: "string",
                path: "poll_title",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "pollTitle",
          type: "string",
        },
        {
          name: "candidateIndex",
          type: "u16",
        },
      ],
    },
    {
      name: "endPoll",
      accounts: [
        {
          name: "pollData",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "arg",
                type: "string",
                path: "poll_title",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "pollTitle",
          type: "string",
        },
      ],
    },
    {
      name: "getResults",
      accounts: [
        {
          name: "pollData",
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "arg",
                type: "string",
                path: "poll_title",
              },
            ],
          },
        },
      ],
      args: [
        {
          name: "pollTitle",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "pollData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pollCreator",
            type: "publicKey",
          },
          {
            name: "pollTitle",
            type: "string",
          },
          {
            name: "options",
            type: {
              vec: "string",
            },
          },
          {
            name: "voteCounts",
            type: {
              vec: "u64",
            },
          },
          {
            name: "expiration",
            type: "i64",
          },
          {
            name: "isActive",
            type: "bool",
          },
          {
            name: "createdAt",
            type: "i64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "CannotVoteOnOwnPoll",
      msg: "Cannot vote on your own poll",
    },
    {
      code: 6001,
      name: "PollNotActive",
      msg: "Poll is not active or has expired",
    },
    {
      code: 6002,
      name: "InvalidCandidate",
      msg: "Invalid candidate index",
    },
    {
      code: 6003,
      name: "NotPollCreator",
      msg: "Only the poll creator can end the poll",
    },
    {
      code: 6004,
      name: "PollAlreadyEnded",
      msg: "Poll has already ended",
    },
    {
      code: 6005,
      name: "PollNotEnded",
      msg: "Poll is still active",
    },
  ],
};
