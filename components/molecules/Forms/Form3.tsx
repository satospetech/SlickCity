import Image from "next/image";
import { motion } from "framer-motion";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ChevronUp, Loader } from "lucide-react";

const Form3 = ({
  loading,
  imageSelect,
  images,
  remove,
  effectSelector,
  effect,
}: {
  loading: boolean;
  imageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  images: { file: File; type: string }[];
  remove: (index: number) => void;
  effectSelector: (prop: string) => void;
  effect: string;
}) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image.file));
    setImageUrl(urls);
    return () => {
      imageUrl.map((image) => URL.revokeObjectURL(image));
    };
  }, [images]);

  const effects = [
    "Ta-da-it",
    "Deflate it",
    "Crumble it",
    "Dissolve it",
    "Squish it",
    "Inflate it",
    "Melt it",
    "Crush it",
    "Cake-ify It",
    "Explode it",
  ];

  const clickHandler = () => {
    if (!effect) {
      setText("Pick an effect");
    } else if (images.length === 0) {
      setText("You need to pick a few images");
    }
    setTitle(true);
    setTimeout(() => {
      setTitle(false);
    }, 1500);
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
          transition={{ ease: "easeLinear", duration: 1 }}
          className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white"
        >
          Share some photos and pick the effect you'd like
        </motion.h1>
      )}
      {title && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 2 }}
          className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white min-h-[56px] xl:min-h-[72px]"
        >
          {text}
        </motion.div>
      )}
      <div className="">
        {" "}
        <div className="relative">
          <label className="block text-white mb-1">Select an Effect</label>
          <div
            className="cursor-pointer h-[41.6px] px-4 rounded-md border flex items-center justify-between text-white"
            onClick={() => setOpen(!open)}
          >
            <span>{effect === "" ? "Select an effect" : effect}</span>
            <ChevronUp
              className={`transition-all ease-linear duration-150 ${
                open ? "" : "rotate-180"
              }`}
            />
          </div>
          <div
            className={`bg-tertiary  w-full rounded-md transition-all absolute ease-linear duration-150 overflow-auto scroll z-10 ${
              open
                ? "h-[187.2px] border border-white"
                : "h-0 border-transparent"
            }`}
          >
            {effects.map((effect, index) => (
              <div
              key={index}
                className="h-[41.6px] text-white px-4 hover:bg-gray-400 flex items-center cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  effectSelector(effect);
                }}
              >
                {effect}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <label className="rounded-md text-white mb-1 aspect-video relative w-full h-auto border flex justify-center items-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-1/4 h-auto fill-white"
            >
              <path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <input
              name="images"
              onChange={imageSelect}
              multiple
              type="file"
              accept=".jpg,.png,.jpeg"
              className="absolute opacity-0"
              placeholder="Enter your phone number"
            />
          </label>
        </div>
        <div className="flex gap-x-2 overflow-x-auto scroll ">
          {imageUrl.map((image, i) => (
            <Image
              src={image}
              alt=""
              className=" max-h-[350px] max-w-[200px] w-auto h-auto object-contain rounded-md"
              width={500}
              height={500}
              onClick={() => remove(i)}
              key={i}
            />
          ))}
        </div>
        <button
          type={images.length === 0 || !effect ? "button" : "submit"}
          onClick={clickHandler}
          className="transition-all duration-150 ease-linear w-full bg-secondary text-white rounded-lg py-2 mt-4 hover:bg-primary active:bg-secondary flex justify-center"
        >
          {loading ? <Loader className="animate-spin" /> : "Send"}
        </button>
      </div>{" "}
    </motion.div>
  );
};

export default Form3;
