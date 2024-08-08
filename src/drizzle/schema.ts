import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const AnalyticsTypeEnum = pgEnum("analitycs_type", [
  "sessionDuration",
  "pageView", // Example one
]);

export const UserAnalyticsTable = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: serial("userId").references(() => UsersTable.id),
  type: AnalyticsTypeEnum("analitycs_type").notNull(),
  value: integer("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const UsersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerkId"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const BooksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: serial("userId").references(() => UsersTable.id),
  bookName: text("bookName").notNull(),
  bookDescription: text("bookDescription").notNull(),
  amountOfChapters: integer("amountOfChapters"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const ChaptersTable = pgTable("chapters", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .notNull()
    .references(() => BooksTable.id),
  chapterNumber: integer("chapterNumber").notNull(),
  chapterTitle: text("chapterTitle").notNull(),
  chapterDescription: text("chapterDescription").notNull(),
  chapterText: text("chapterText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
