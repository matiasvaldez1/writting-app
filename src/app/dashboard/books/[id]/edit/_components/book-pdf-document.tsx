import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import type { BooksAndChapters } from "@/types/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  section: {
    marginBottom: 20,
  },
  chapterTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  chapterDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: "#666666",
  },
});

const htmlStylesheet = {
  h1: { fontSize: 24, fontWeight: "bold", marginBottom: 8, marginTop: 12 },
  h2: { fontSize: 20, fontWeight: "bold", marginBottom: 6, marginTop: 10 },
  h3: { fontSize: 16, fontWeight: "bold", marginBottom: 4, marginTop: 8 },
  h4: { fontSize: 14, fontWeight: "bold", marginBottom: 4, marginTop: 6 },
  h5: { fontSize: 12, fontWeight: "bold", marginBottom: 2, marginTop: 4 },
  h6: { fontSize: 11, fontWeight: "bold", marginBottom: 2, marginTop: 4 },
  p: { fontSize: 12, lineHeight: 1.6, marginBottom: 6 },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  u: { textDecoration: "underline" },
  s: { textDecoration: "line-through" },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "#cccccc",
    paddingLeft: 10,
    fontStyle: "italic",
    color: "#555555",
    marginBottom: 8,
    marginTop: 8,
  },
  code: { fontFamily: "Courier", backgroundColor: "#f4f4f4", fontSize: 10 },
  pre: {
    fontFamily: "Courier",
    backgroundColor: "#f4f4f4",
    padding: 8,
    fontSize: 10,
    marginBottom: 8,
  },
  ul: { marginLeft: 20, marginBottom: 6 },
  ol: { marginLeft: 20, marginBottom: 6 },
  li: { fontSize: 12, marginBottom: 2 },
  a: { color: "#1a73e8", textDecoration: "underline" },
  img: { maxWidth: 400 },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginTop: 12,
    marginBottom: 12,
  },
} as Record<string, Record<string, string | number>>;

function proxyImageUrls(html: string): string {
  if (!html) return html;
  return html.replace(
    /<img([^>]*?)src="([^"]+)"([^>]*?)>/gi,
    (_match, before: string, src: string, after: string) => {
      if (src.startsWith("data:") || src.startsWith("/api/image-proxy")) {
        return `<img${before}src="${src}"${after}>`;
      }
      const proxied = `/api/image-proxy?url=${encodeURIComponent(src)}`;
      return `<img${before}src="${proxied}"${after}>`;
    }
  );
}

export default function PdfDocumentFromBook({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  return (
    <Document>
      {bookAndChapters.chapters.map((chapter, index) => (
        <Page key={index} size="A4" style={styles.page} wrap>
          <View style={styles.section}>
            <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
            <Text style={styles.chapterDescription}>
              {chapter.chapterDescription}
            </Text>
          </View>
          <View style={styles.section} wrap>
            <Html style={{ fontSize: 12 }} stylesheet={htmlStylesheet}>
              {proxyImageUrls(chapter.chapterText)}
            </Html>
          </View>
        </Page>
      ))}
    </Document>
  );
}
