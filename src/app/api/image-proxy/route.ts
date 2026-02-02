import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!ALLOWED_TYPES.some((t) => contentType.startsWith(t))) {
      return NextResponse.json({ error: "Not an image" }, { status: 400 });
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 502 }
    );
  }
}
