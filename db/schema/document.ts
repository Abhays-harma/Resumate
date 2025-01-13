import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { personalInfoTable } from "./personal-info";
import { experienceTable } from "./experience";
import { educationTable } from "./education";
import { skillsTable } from "./skills";

export const statusEnum = pgEnum("status", ["archived", "private", "public"]);

export const documentTable = pgTable("document", {
    id: serial("id").notNull().primaryKey(),
    documentId: varchar("document_id").unique().notNull(),
    userId: varchar("user_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    summary: text("summary"),
    themeColor: varchar("theme_color", { length: 255 }).default('#1973e8'),
    currentPosition: integer("current_position").default(1),
    authorName: varchar("author_name", { length: 255 }).notNull(),
    authorEmail: varchar("author_email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    status: statusEnum("status").default("private"),
})


export const documentRelations=relations(
    documentTable,({one,many})=>({
        personalInfo:one(personalInfoTable),
        experiences:many(experienceTable),
        educations:many(educationTable),
        skills:many(skillsTable),
    })
)
