import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const AnalyticsTypeEnum = pgEnum("analytics_type", [
  "sessionDuration",
  "pageView",
]);

export const UsersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerkId").notNull().unique(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
      clerkIdIdx: uniqueIndex("clerkId_unique_idx").on(users.clerkId),
    };
  }
);

export const BooksTable = pgTable(
  "books",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    bookName: text("bookName").notNull(),
    bookDescription: text("bookDescription").notNull(),
    amountOfChapters: integer("amountOfChapters"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (books) => {
    return {
      userIdIdx: index("books_userId_idx").on(books.userId),
    };
  }
);

export const ChaptersTable = pgTable(
  "chapters",
  {
    id: serial("id").primaryKey(),
    bookId: integer("bookId")
      .notNull()
      .references(() => BooksTable.id, { onDelete: "cascade" }),
    chapterNumber: integer("chapterNumber").notNull(),
    chapterTitle: text("chapterTitle").notNull(),
    chapterDescription: text("chapterDescription").notNull(),
    chapterText: text("chapterText").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (chapters) => {
    return {
      bookIdIdx: index("chapters_bookId_idx").on(chapters.bookId),
    };
  }
);

export const UserAnalyticsTable = pgTable(
  "user_analytics",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    type: AnalyticsTypeEnum("analytics_type").notNull(),
    value: integer("value").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (analytics) => {
    return {
      userIdIdx: index("analytics_userId_idx").on(analytics.userId),
    };
  }
);
