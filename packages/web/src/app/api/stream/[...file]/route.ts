import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getDataPath } from "@packages/common";

const getFileBlob = (path: string) => {
  try {
    return fs.readFileSync(path);
  } catch (e) {
    return null;
  }
};

export const GET = (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const inputFileBasePath = url.pathname.split("/").slice(3).join("/");

    const storeDirPath = getDataPath("/store");
    const inputFilePath = path.join(storeDirPath, inputFileBasePath);
    const inputFileUrl = new URL(inputFilePath, req.nextUrl);
    const inputFileExt = path.extname(inputFileUrl.pathname);

    const blob = getFileBlob(inputFilePath);

    if (!blob) {
      return new NextResponse(null, { status: 404, statusText: "Not Found" });
    }

    let contentTypeHeader;

    switch (inputFileExt) {
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
    if (e instanceof Error) console.log(e.message);
    return new NextResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
