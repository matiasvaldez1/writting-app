import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { BooksAndChapters } from "@/types/types";
import { MAX_WORDS_PER_PAGE } from "@/lib/constants";
import Html from "react-pdf-html";

function renderChapterText(text: string) {
  const words = text.split(/\s+/);
  const pages = [];
  let currentPage: string[] = [];
  let wordCount = 0;

  for (const word of words) {
    if (wordCount + word.length > MAX_WORDS_PER_PAGE) {
      pages.push(currentPage.join(" "));
      currentPage = [word];
      wordCount = word.length;
    } else {
      currentPage.push(word);
      wordCount += word.length;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join(" "));
  }

  return pages.map((pageText, index) => (
    <Html stylesheet={styles} style={{ fontSize: "12px" }} key={index}>
      {pageText}
    </Html>
  ));
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
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
  },
  chapterText: {
    fontSize: 14,
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
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
            <Text style={styles.chapterDescription}>
              {chapter.chapterDescription}
            </Text>
            <Text>{renderChapterText(chapter.chapterText)}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
