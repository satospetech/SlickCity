"use client";
import axios from "axios";
import Link from "next/link";
import JSZip from "jszip";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MailIcon, PhoneIcon } from "lucide-react";
import { saveAs } from "file-saver";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

interface Post {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  _id: string;
  images: string[];
  effect: string;
}

const Page = () => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [videos, setVideos] = useState<File[]>([]);
  const detailsRef = useRef({ name: "", email: "", id: "" });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const images = await axios.get("/api/image/fetch");
        setPosts(images.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  const download = async (urls: string[], user: string) => {
    try {
      setDownloading(true);
      const zip = new JSZip();
      const remoteZips = urls.map(async (file: string) => {
        const response = await fetch(file);
        const data = await response.blob();
        zip.file(`${file.split("/")[5].split("?")[0]}`, data);
        return data;
      });
      await Promise.all(remoteZips);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, user);
    } catch (err) {
      console.log(err);
    } finally {
      setDownloading(false);
    }
  };

  const sendMail = async (email: string, name: string) => {
    setSending(true);
    const chunkSize = 2 * 1024 * 1024; // 1 MB per chunk
    const totalChunks = Math.ceil(videos[0].size / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunk = videos[0].slice(start, end);

      // Use FormData to send each chunk with metadata
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("fileName", videos[0].name);
      formData.append("chunkIndex", i.toString());
      formData.append("totalChunks", totalChunks.toString());
      try {
        const req = await fetch("/api/image/chunking", {
          method: "POST",
          body: formData,
        });
        const res = await req.json();
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }

    try {
      const res = await axios.post("/api/image/sendToUser", {
        fileName: videos[0].name,
        email,
        name,
      });
      if (res.data.status === 200) toast.success("Video has been sent to user");
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setSending(false);
    }
  };

  const imageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const files: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i]);
      }
      setVideos(files);
    }
  };

  return (
    <div className="bg-tertiary min-h-screen p-4 xl:p-6 font-roob text-white ">
      <div className="max-xl:max-w-3xl xl:w-8/12 mx-auto">
        <h1 className="text-2xl  xl:text-4xl  mb-5 xl:mb-10 mt-12 xl:mt-20">
          File Downloads
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
              <div
                className="h-32 bg-gray-400 animate-pulse rounded-xl"
                key={index}
              />
            ))}
          </div>
        ) : (
          <div className="">
            {posts.length === 0 ? (
              <div className="h-[50vh] flex items-center justify-center">
                <p className="text-xl xl:text-4xl text-center">
                  No one has uploaded anything yet. Be a bit more patient
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {posts.map((post: Post, index: number) => (
                  <div className="border rounded-2xl p-3" key={index}>
                    <h2 className="text-xl xl:text-2xl font-medium mb-2">
                      {post.firstName} {post.lastName}
                    </h2>
                    <Link
                      href={`mailto:${post.email}?subject=Your%20Video%20Is%20Ready!!!&body=Heyy%20${post.firstName}%0D%0A%0D%0AHere's%20the%20video%20you%20requested.%20We%20hope%20you%20like%20it!!%0D%0A%0D%0AWarm Regards,%0DSlick City Team`}
                      target="_blank"
                      className="flex gap-x-2 items-center active:text-gray-400 text-gray-300 hover:text-gray-700 transition-all ease-linear duration-150 "
                    >
                      <MailIcon color="white" size="20" /> {post.email}
                    </Link>
                    <Link
                      href={`tel:${post.phoneNumber}`}
                      target="_blank"
                      className="flex items-center gap-x-2
                      text-gray-300 active:text-gray-400 hover:text-gray-700
                      transition-all ease-linear duration-150 mb-2"
                    >
                      <PhoneIcon color="white" size="20" />
                      {post.phoneNumber}
                    </Link>
                    <p className="animate-pulse">{post.effect}</p>
                    <div className="flex justify-end gap-x-3 mt-2 items-center">
                      <button
                        className="px-4 py-2 text-white rounded-lg bg-secondary hover:bg-primary active:bg-secondary transition-all ease-linear duration-150 flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          download(
                            post.images,
                            `${post.firstName}${post.lastName}`
                          );
                          detailsRef.current = {
                            name: post.firstName,
                            email: post.email,
                            id: post.images[0],
                          };
                        }}
                      >
                        {downloading &&
                        detailsRef.current.id === post.images[0] ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Download"
                        )}
                      </button>{" "}
                      <button
                        className="px-4 py-2 text-white rounded-lg bg-primary hover:bg-secondary active:bg-primary transition-all ease-linear duration-150 flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          setOpen(true);
                          detailsRef.current = {
                            name: post.firstName,
                            email: post.email,
                            id: post.images[0],
                          };
                        }}
                      >
                        {" "}
                        {sending && detailsRef.current.id === post.images[0] ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Send Media"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {open && (
        <div className="h-screen fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black/20 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white max-w-lg w-10/12 md:w-6/12 xl:w-3/12 rounded-xl p-3">
            {" "}
            <p className="text-tertiary">
              Select the files you want to send
            </p>{" "}
            <div className="mt-2">
              <label className="rounded-lg text-tertiary mb-1 aspect-video relative w-full h-auto border-2 flex justify-center items-center cursor-pointer">
                <input
                  name="images"
                  onChange={imageSelect}
                  type="file"
                  accept=".mp4"
                  className="max-w-[300px]"
                />
              </label>
            </div>
            <div className="flex justify-end gap-x-3 mt-2 items-center">
              <button
                className="px-4 py-2 text-white rounded-lg bg-secondary hover:bg-primary active:bg-secondary transition-all ease-linear duration-150 flex items-center justify-center"
                type="button"
                disabled={videos.length === 0}
                onClick={() => {
                  setOpen(false);
                  sendMail(detailsRef.current.email, detailsRef.current.name);
                }}
              >
                {sending ? <Loader /> : "Send to User"}
              </button>{" "}
              <button
                className="px-4 py-2 text-primary rounded-lg border hover:text-white border-primary hover:bg-secondary active:bg-primary transition-all ease-linear duration-150 flex items-center justify-center"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setVideos([]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
