import React from "react";
import { FaRegStarHalf } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent flex mb-2 gap-5 text-3xl  font-bold text-white-600 hover:scale-105 transition-all duration-300">
        <FaRegStarHalf className="text-yellow-400" />
        AI text summarizer
      </h1>
      <p className=" text-sm md:text-md lg:text-xl font-bold ">Powered by Google Gemini AI</p>
    </div>
  );
};

export default Header;
