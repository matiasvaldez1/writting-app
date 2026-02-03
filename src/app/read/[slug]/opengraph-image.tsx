import { ImageResponse } from "next/og";
import { getBookBySlugUseCase } from "@/use-cases/books";

export const alt = "Escribí";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const book = await getBookBySlugUseCase({ slug: params.slug });

  if (!book) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0f",
          color: "#fff",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        Escribí
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0f",
        color: "#fff",
        padding: 80,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {book.bookName}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a0a0b0",
            maxWidth: 800,
          }}
        >
          {book.bookDescription.slice(0, 120)}
          {book.bookDescription.length > 120 ? "..." : ""}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ fontSize: 20, color: "#a0a0b0" }}>{book.authorName}</div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#818cf8",
          }}
        >
          Escribí
        </div>
      </div>
    </div>,
    { ...size }
  );
}
