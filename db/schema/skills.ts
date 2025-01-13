import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { relations } from "drizzle-orm";

export const skillsTable = pgTable("skills", {
    id: serial("id").primaryKey(),
    docId: integer("document_id")
      .references(() => documentTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    name: varchar("name", { length: 255 }),
    rating: integer("rating").notNull().default(0),
  });
  
  export const skillsRelations = relations(skillsTable, ({ one }) => ({
    document: one(documentTable, {
      fields: [skillsTable.docId],
      references: [documentTable.id],
    }),
  }));