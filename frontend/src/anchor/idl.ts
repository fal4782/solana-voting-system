import { VotingApp } from "./idl.types";

export const IDL: VotingApp = {
  version: "0.1.0",
  name: "voting_app",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "votingData",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "voting_data",
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
          name: "numOptions",
          type: "u16",
        },
      ],
    },
    {
      name: "vote",
      accounts: [
        {
          name: "votingData",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "voting_data",
              },
            ],
          },
        },
      ],
      args: [
        {
          name: "candidateIndex",
          type: "u16",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "VotingData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "voteCounts",
            type: {
              vec: "u64",
            },
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidNumberOfOptions",
      msg: "Invalid number of options (must be between 1 and 1000)",
    },
    {
      code: 6001,
      name: "InvalidCandidate",
      msg: "Invalid candidate index",
    },
  ],
  metadata: {
    address: "75GwYpCopgByConQ6dwwQtM8UYMnJsxWURLJwBp1L2hm",
  },
};
