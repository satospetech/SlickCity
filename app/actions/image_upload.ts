"use server";

import ImageUpload from "@/schema/imageSchema/imageSchema";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import AWS from "aws-sdk";



const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

AWS.config.update({
  region: "eu-north-1",
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
});

const s3 = new AWS.S3();

async function uploadFileToS3(file: Buffer, key: string, type: string) {

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
    Key: `${key}`,
    Body: file,
    ContentType: type,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `${key}`;
}

export const Imageupload = async (form: FormData) => {
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const baseKey = `${firstName}${lastName}${Date.now()}`;
  try {
    const imageList = form.getAll("image");
    const types = form.getAll("type");
    const images: { file: File; type: string }[] = imageList.map(
      (image, index) => ({
        file: image as File,
        type: types[index] as string,
      })
    );

    const signedUrl = [];
    for (let i = 0; i < images.length; i++) {
      const buffer = Buffer.from(await images[i].file.arrayBuffer());
      const filekey = await uploadFileToS3(
        buffer,
        `slickcity/${baseKey}/${(Date.now() + i * 10).toString()}`,
        images[i].type
      );
      const input = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
        Key: filekey,
        ResponseContentDisposition: "attachment",
        Expires: 604800,
      };
      signedUrl.push(s3.getSignedUrl("getObject", input));
      const command = new GetObjectCommand(input);
      await s3Client.send(command);
    }
    const upload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phoneNumber: form.get("phoneNumber"),
      images: signedUrl,
      effect: form.get("effect"),
    };
    const image = new ImageUpload(upload);
    const uploaded = await image.save();
    return JSON.stringify({
      status: 201,
      message: "Images Uploaded Successfully",
      data: { answer: uploaded, url: signedUrl },
    });
  } catch (err) {
    if (err instanceof Error) {
      //console.log("error", err.message);
      return { status: 500, message: err.message };
    }
    return { status: 500, message: "An unknown error occurred" };
  }
};