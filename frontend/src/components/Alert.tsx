// components/Alert.tsx
import React, { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const extractErrorMessage = (errorMessage: string): string => {
    const messageStart = errorMessage.indexOf("Error Message:");
    if (messageStart === -1) return errorMessage; // Return the whole message if "Error Message:" not found
    return errorMessage
      .substring(messageStart + "Error Message:".length)
      .trim();
  };

  const errorMessage = extractErrorMessage(message);

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500"
      : "bg-red-100 border-red-500";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";

  // Automatically close the alert after 1 second (1000ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 200);

    // Cleanup the timonClick={onClose}er if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-xs w-full border-l-4 p-4 ${bgColor} ${textColor} shadow-md rounded-md flex items-center`}
      role="alert"
    >
      <p className="flex-grow">{errorMessage}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-900 focus:outline-none"
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-5 w-5"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
