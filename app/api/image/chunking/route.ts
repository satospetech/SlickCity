import fs from "fs";
import path from "path";
import {response} from '@/lib/res'

export async function POST(req: Request) {
  const data = await req.formData();
  const chunk = data.get("file") as File;
  const fileName = data.get("fileName") as string;
  const chunkIndex = parseInt(data.get("chunkIndex") as string, 10);

  const tempDir = path.join("/tmp", fileName);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const chunkPath = path.join(tempDir, `${chunkIndex}`);
  const buffer = Buffer.from(await chunk.arrayBuffer());
  fs.writeFileSync(chunkPath, buffer);

  return response(200, 'Chunk Received')
}
