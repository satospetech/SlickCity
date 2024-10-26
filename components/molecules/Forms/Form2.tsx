import { motion } from "framer-motion";
import React, { ChangeEvent, useState } from "react";

const Form2 = ({
  next,
  onChange,
  name,
  email,
  phoneNumber,
}: {
  next: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  email: string;
  phoneNumber: string;
}) => {
  const [title, setTitle] = useState(false);
  const nextPage = () => {
    if (!email || !phoneNumber) {
      setTitle(true);
      setTimeout(() => {
        setTitle(false);
      }, 1500);
    } else {
      next();
    }
  };
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 1, delay: 0.5 }}
      className="p-8 max-w-lg w-full font-roob"
    >
      {!title && (
        <motion.h1
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
             className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white"
        >
          Nice to meet you <span className="capitalize">{name}</span>. How can
          we reach you?
        </motion.h1>
      )}
      {title && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 3 }}
             className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white"
        >
          We really need these details. Don&apos;t go just yet
        </motion.div>
      )}
      <div className="">
        {" "}
        <div>
          <label className="block text-white mb-1 text-sm">Email</label>
          <input
            name="email"
            onChange={onChange}
            type="email"
            className="w-full px-4 py-2 border rounded-md bg-transparent outline-none placeholder:text-white text-white"
            placeholder="Enter your email"
          />
        </div>
        <div className="mt-2">
          <label className="block text-white mb-1 text-sm">Phone Number</label>
          <input
            name="phoneNumber"
            onChange={onChange}
            type="tel"
            className="w-full px-4 py-2 border rounded-md bg-transparent outline-none placeholder:text-white text-white"
            placeholder="Enter your phone number"value={phoneNumber}
          />
        </div>
        <button
          type="button"
          onClick={nextPage}
          className="transition-all duration-150 ease-linear w-full bg-secondary text-white rounded-lg py-2 mt-4 hover:bg-primary active:bg-secondary"
        >
          Next
        </button>
      </div>{" "}
    </motion.div>
  );
};

export default Form2;
