import { VotingContract } from "./idl.types";

export const IDL: VotingContract = {
  address: "AFeMMkA1C8ptiyAvP7tktUzbjXJrteksDYS2wEg81u6",
  metadata: {
    name: "votingContract",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "votingData",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 111, 116, 105, 110, 103, 95, 100, 97, 116, 97],
              },
            ],
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
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
      discriminator: [227, 110, 155, 23, 136, 126, 172, 25],
      accounts: [
        {
          name: "votingData",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 111, 116, 105, 110, 103, 95, 100, 97, 116, 97],
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
      name: "votingData",
      discriminator: [60, 192, 169, 212, 144, 241, 88, 239],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "invalidNumberOfOptions",
      msg: "Invalid number of options (must be between 1 and 1000)",
    },
    {
      code: 6001,
      name: "invalidCandidate",
      msg: "Invalid candidate index",
    },
  ],
  types: [
    {
      name: "votingData",
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
};
