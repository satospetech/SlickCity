import { response } from "@/lib/res";
import ImageUpload from "@/schema/imageSchema/imageSchema";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import AWS from "aws-sdk";

interface Obj {
  [key: string]: string;
}

const formats: Obj = {
  jpg: "jpg",
  jpeg: "jpeg",
  png: "png",
};

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

async function uploadFileToS3(file:Buffer, key: string, type: string) {
  const regex = /[^a-zA-Z0-9\s]/g;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
    Key: `${key}.${formats[type.split("/")[1].replace(regex, "")]}`,
    Body: file,
    ContentType: type,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `${key}.${formats[type.split("/")[1].replace(regex, "")]}`;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const baseKey = `${firstName}${lastName}${Date.now()}`;
  try {
    const imageList = formData.getAll("image");
    const types = formData.getAll("type");
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
      console.log("final:", signedUrl);
    }
    const upload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      images: signedUrl,
      effect: formData.get("effect"),
    };
    const image = new ImageUpload(upload);
    const uploaded = await image.save();
    return response(201, "Images have been uploaded successfully", {
      answer: uploaded,
      url: signedUrl,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("error", err.message);
      return response(500, err.message);
    }
    return response(500, "An unknown error occurred");
  }
}