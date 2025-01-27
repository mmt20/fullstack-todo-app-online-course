import React from "react";

const TodoSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-white shadow-sm hover:shadow-md">
      <div className="flex flex-col space-y-2 w-full">
        <div className="h-3 bg-gray-600 rounded-full shimmer w-28"></div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-9 w-24 bg-gray-600 rounded-md shimmer"></div>
        <div className="h-9 w-24 bg-gray-600 rounded-md shimmer"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
