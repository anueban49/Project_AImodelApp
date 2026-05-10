"use client";

export const LoadingVisual = () => {
  return (
    <div className="flex gap-1.5 items-center px-5">
      <div 
        className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
        style={{ animationDelay: "0s" }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};
