import { boolean, date, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { relations } from "drizzle-orm";

export const projectTable = pgTable("project", {
    id: serial("id").notNull().primaryKey(),
    docId: integer("document_id").references(() => documentTable.id, {
        onDelete: 'cascade'
    }),
    title: varchar("title", { length: 255 }),
    organization: varchar("organization", { length: 255 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    currentlyWorking:boolean("currently_working").notNull().default(false),
    description:text("description"),
    projectLink:varchar("project-link",{length:255}),
    technologies: varchar("technologies", { length: 255 }).array()
})

export const projectRelations=relations(
    projectTable,({one})=>({
        document:one(documentTable,{
            fields:[projectTable.docId],
            references:[documentTable.id]
        })
    })
)