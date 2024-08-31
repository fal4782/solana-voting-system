// // components/PollList.tsx
// import React from "react";
// import { Link } from "react-router-dom";

// interface Poll {
//   title: string;
//   publicKey: string;
// }

// interface PollListProps {
//   polls: Poll[];
// }

// const PollList: React.FC<PollListProps> = ({ polls }) => {
//   return (
//     <ul className="space-y-2">
//       {polls.map((poll) => (
//         <Link to={`/poll/${poll.title}`} className="">
//           <li
//             key={poll.publicKey}
//             className="bg-slate-200 p-4 rounded shadow hover:scale-105 transition ease-in-out cursor-pointer"
//           >
//             {poll.title}
//           </li>
//         </Link>
//       ))}
//     </ul>
//   );
// };

// export default PollList;

// components/PollList.tsx

import React from "react";
import { Link } from "react-router-dom";

interface Poll {
  title: string;
  publicKey: string;
  isActive: boolean;
  expiration: number;
}

interface PollListProps {
  polls: Poll[];
}

const PollList: React.FC<PollListProps> = ({ polls }) => {
  return (
    <ul className="space-y-2">
      {polls.map((poll) => (
        <Link to={`/poll/${poll.title}`} key={poll.publicKey}>
          <li className="bg-slate-200 p-4 rounded shadow hover:scale-105 transition ease-in-out cursor-pointer flex justify-between items-center">
            <span>{poll.title}</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                poll.isActive && poll.expiration > Date.now() / 1000
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {poll.isActive && poll.expiration > Date.now() / 1000
                ? "Open"
                : "Finished"}
            </span>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default PollList;
