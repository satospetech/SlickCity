
import { response } from "@/lib/res";
import ImageUpload from "@/schema/imageSchema/imageSchema";

export async function GET(request: Request) {
  try {
    const images = await ImageUpload.find();
    return response(200, "Posts fetched successfully", images);
  } catch (err) {
    console.log(err);
  }
}
