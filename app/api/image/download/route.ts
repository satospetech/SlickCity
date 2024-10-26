import JSZip from "jszip";
import { response } from "@/lib/res";

export async function POST(request: Request) {
  const { urls } = await request.json(); //;
  try {
    const zip = new JSZip();
    const remoteZips = urls.map(async (file: string) => {
      const response = await fetch(file);
      const data = await response.blob();
      zip.file(`${file.split("/")[5].split("?")[0]}`, data);

      return data;
    });
    Promise.all(remoteZips)
      .then(() => {
        zip.generateAsync({ type: "blob" }).then((content) => {
          // give the zip file a name
          saveAs(content, "zip-download-next-js.zip");
        });
      })
      .catch(() => {});
    const zipBlob = await zip.generateAsync({ type: "blob" });
    console.log(zipBlob);
    return response(200, "Posts fetched successfully", {});
  } catch (err: any) {
    console.log(err.message);
  }
}
function saveAs(content: Blob, arg1: string) {
  throw new Error("Function not implemented.");
}
