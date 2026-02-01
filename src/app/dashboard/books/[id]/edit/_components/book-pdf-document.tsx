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
            <Html style={{ fontSize: 12 }}>{chapter.chapterText}</Html>
          </View>
        </Page>
      ))}
    </Document>
  );
}
