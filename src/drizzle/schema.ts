import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
 
export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    clerkId: text('clerkId'),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  },
);

export const BoooksTable = pgTable(
  'books',
  {
    id: serial('id').primaryKey(),
    userId: serial('userId').references(() => UsersTable.id),
    bookName: text('bookName').notNull(),
    bookDescription: text('bookDescription').notNull(),
    amountOfChapters: text('amountOfChapters'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
);