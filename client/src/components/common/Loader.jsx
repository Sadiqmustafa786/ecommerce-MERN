import React from "react";

const Loader = ({ variant = "page" }) => {
  const isButton = variant === "button";

  return (
    <div
      className={`flex items-center justify-center ${isButton ? "p-0" : "p-5"}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`rounded-full border-t-transparent animate-spin ${
          isButton
            ? "h-5 w-5 border-2 border-white/80"
            : "h-10 w-10 border-4 border-primary"
        }`}
      ></div>
    </div>
  );
};

export default Loader;
