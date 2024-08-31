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
    <ul className="space-y-4 max-w-xxl mx-auto">
      {" "}
      {/* Max width of the list set to medium size */}
      {polls.map((poll) => (
        <li key={poll.publicKey} className="group">
          <Link
            to={`/poll/${poll.title}`}
            className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out group-hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-md font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200 ease-in-out">
                {poll.title}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  poll.isActive && poll.expiration > Date.now() / 1000
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {poll.isActive && poll.expiration > Date.now() / 1000
                  ? "Open"
                  : "Finished"}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PollList;
