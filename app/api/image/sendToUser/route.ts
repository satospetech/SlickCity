import { SendEmail } from "@/lib/mail";
import { response } from "@/lib/res";

export async function POST(req: Request) {
  const formData = await req.formData();
  try {
    const fileList = formData.getAll("file") as File[];
    const name = formData.get("name");
    const email = formData.get("email")!;
    const attachments: {
      fileName: string;
      content: Buffer;
      contentType: string;
    }[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const buffer = Buffer.from(await fileList[i].arrayBuffer());
      attachments.push({
        fileName: fileList[i].name,
        content: buffer,
        contentType: fileList[i].type,
      });
    }
     await SendEmail(
      `<html><body>Heyy ${name}<br><br><p>Here's the video. We hope you like it.<br><br>Warm regards<br>Slick City Team</p></body></html>`,
      "Your Video is Ready!!!",
      email.toString(),
      attachments
    );
    return response(200, `The video was sent to ${name} successfully`);
  } catch (err) {
    if (err instanceof Error) {
      return response(500, err.message);
    }
    return response(500, "An unknown error occurred");
  }
}
