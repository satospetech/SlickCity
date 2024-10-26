import React, { ChangeEvent,useState } from "react";
import { motion } from "framer-motion";

const Form1 = ({
  next,
  onChange,
  firstName,
  lastName,
}: {
  next: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  firstName: string;
  lastName: string;
}) => {
  const [title, setTitle] = useState(false);
  const nextPage = () => {
    if (!firstName || !lastName) {
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
      transition={{ ease: "easeInOut", duration: 1 }}
      className="p-4 xl:p-8 max-w-lg w-full font-roob"
    >
      {!title && (
        <motion.h1
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
          className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white"
        >
          Hey there. Whats your name?
        </motion.h1>
      )}
      {title && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 2 }}
          className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white"
        >
          You havent said your name yet.
        </motion.div>
      )}

      <div className="group text-white">
        <label className="block text-white mb-1 text-sm">First Name</label>
        <input
          name="firstName"
          onChange={onChange}
          type="text"
          className="relative w-full py-2 border px-4 rounded-md bg-transparent outline-none placeholder:text-gray-200 placeholder:text-sm focus:border-primary transition-all duration-150 ease-linear text-white"
          placeholder="Malik"
        />
      </div>
      <div className="mt-2">
        <label className="block text-white mb-1 text-sm">Last Name</label>
        <input
          type="text"
          name="lastName"
          onChange={onChange}
          className="relative w-full py-2 border px-4 rounded-md bg-transparent outline-none placeholder:text-gray-200 placeholder:text-sm focus:border-primary transition-all duration-150 ease-linear text-white"
          placeholder="Afegbua"
        />
      </div>
      <button
        type="button"
        onClick={nextPage}
        className="transition-all duration-150 ease-linear w-full bg-secondary text-white rounded-lg py-2 mt-4 hover:bg-primary active:bg-secondary"
      >
        Next
      </button>
    </motion.div>
  );
};

export default Form1;
