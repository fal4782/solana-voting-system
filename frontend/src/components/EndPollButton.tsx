import React from "react";

interface EndPollButtonProps {
  onEndPoll: () => void;
  isEnding: boolean;
  isCreator: boolean; // Check if the user is the creator
}

const EndPollButton: React.FC<EndPollButtonProps> = ({ onEndPoll, isEnding, isCreator }) => {
  if (!isCreator) return null; // Hide if the user is not the creator

  return (
    <button onClick={onEndPoll} disabled={isEnding}>
      {isEnding ? "Ending Poll..." : "End Poll"}
    </button>
  );
};

export default EndPollButton;
