import fs from "fs";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { getDataPath } from "@packages/common";

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string[] } },
) {
  try {
    const mediaPath = getDataPath(params.file.join("/"));
    const mediaUrl = new URL(mediaPath, request.nextUrl);
    const extension = path.extname(mediaUrl.pathname);

    const blob = fs.readFileSync(mediaPath);

    let contentTypeHeader;

    switch (extension) {
      case ".m3u8":
        contentTypeHeader = "application/vnd.apple.mpegurl";
        break;
      case ".ts":
        contentTypeHeader = "video/MP2T";
        break;
      default:
        contentTypeHeader = "application/octet-stream";
    }

    const headers = new Headers();
    headers.set("Content-Type", contentTypeHeader);

    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (e) {
    console.error(`Error loading ${params.file.join("/")}`);
    if (e instanceof Error) console.log(e.message);
    return new NextResponse(null, { status: 404, statusText: "Not Found" });
  }
}
