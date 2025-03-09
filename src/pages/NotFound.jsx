import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="mt-2 mb-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-6 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
