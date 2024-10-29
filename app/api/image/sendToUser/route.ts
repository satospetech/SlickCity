import { SendEmail } from "@/lib/mail";
import { response } from "@/lib/res";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { fileName, email, name,  } = await req.json();

    // Temporary directory for storing chunks
    const tempDir = path.join("/tmp", fileName);

    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      return new Response("Directory not found", { status: 404 });
    }

    // Path for the final reassembled file
    const finalFilePath = path.join("/tmp", `${fileName}.mp4`);

    // Write the reassembled file by appending each chunk in order
    const writeStream = fs.createWriteStream(finalFilePath);

    const files = fs.readdirSync(tempDir);
    const orderedFiles = files.sort((a, b) => parseInt(a) - parseInt(b));

    for (const file of orderedFiles) {
      const chunkPath = path.join(tempDir, file);
      const chunk = fs.readFileSync(chunkPath);
      writeStream.write(chunk);
    }

    // Close the stream
    writeStream.end();

    await SendEmail(
      `<html><body>Heyy ${name}<br><br><p>Here's the video. We hope you like it.<br><br>Warm regards<br>Slick City Team</p></body></html>`,
      "Your Video is Ready!!!",
      email,
      [{ fileName, path: finalFilePath }]
    ); // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(finalFilePath);
    return response(200, `The video was sent to ${name} successfully`);
  } catch (err) {
    if (err instanceof Error) {
      return response(500, err.message);
    }
    return response(500, "An unknown error occurred");
  }
}
