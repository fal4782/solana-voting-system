// components/PollList.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Poll {
  title: string;
  publicKey: string;
}

interface PollListProps {
  polls: Poll[];
}

const PollList: React.FC<PollListProps> = ({ polls }) => {
  return (
    <ul className="space-y-2">
      {polls.map((poll) => (
        <li key={poll.publicKey} className="bg-white p-4 rounded shadow">
          <Link
            to={`/poll/${poll.title}`}
            className="text-blue-600 hover:underline"
          >
            {poll.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PollList;
