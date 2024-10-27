"use client";
import Form1 from "@/components/molecules/Forms/Form1";
import Form2 from "@/components/molecules/Forms/Form2";
import Form3 from "@/components/molecules/Forms/Form3";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Imageupload } from "./actions/image_upload";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(1);
  const [images, setImages] = useState<{ file: File; type: string }[]>([]);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    effect: "",
  });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name !== "phoneNumber") {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.replace(/[^0-9]/g, ""),
      }));
    }
  };
  const imageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const files: { file: File; type: string }[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        console.log(e.target.files[i].type)
        files.push({ file: e.target.files[i], type: e.target.files[i].type});
      }
      setImages((prev) => [...prev, ...files]);
    }
  };
  const removeImage = (index: number) => {
    setImages((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  const effectSelector = (effect: string) => {
    setData((prev) => ({ ...prev, effect: effect }));
  };

  const next = async () => {
    if (form < 3) {
      setForm(form + 1);
    } else {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("effect", data.effect);
      images.forEach((image) => {
        formData.append(`image`, image.file);
        formData.append("type", image.type);
      });
      setLoading(true);
      try {
        const req = await Imageupload(formData);
        const result = await JSON.parse(req as string)
        if (result.status === 201) {
          setForm(4);
          setImages([]);
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    next();
  };
  useEffect(() => {
    if (form === 4) {
      setTimeout(() => {
        setForm(1);
      }, 5000);
    }
  }, [form]);
  return (
    <form
      className="bg-tertiary min-h-screen py-4 flex items-center justify-center"
      onSubmit={submitHandler}
    >
      {form === 1 && (
        <Form1
          next={next}
          onChange={inputChangeHandler}
          firstName={data.firstName}
          lastName={data.lastName}
        />
      )}
      {form === 2 && (
        <Form2
          next={next}
          onChange={inputChangeHandler}
          name={data.firstName}
          email={data.email}
          phoneNumber={data.phoneNumber}
        />
      )}
      {form === 3 && (
        <Form3
          imageSelect={imageSelect}
          images={images}
          remove={removeImage}
          effectSelector={effectSelector}
          effect={data.effect}
          loading={loading}
        />
      )}
      {form === 4 && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
        >
          <motion.h1
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 1 }}
            className="text-xl xl:text-3xl font-semibold text-center mb-4 xl:mb-6 text-white px-4 max-w-lg"
          >
            We&apos;ll send you a video in a couple of minutes. You can send
            more pictures and we&apos;ll make more videos
          </motion.h1>
        </motion.div>
      )}
    </form>
  );
};
export default Home;
