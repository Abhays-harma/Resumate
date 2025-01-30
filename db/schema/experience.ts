import { relations } from "drizzle-orm";
import { boolean, date, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { documentTable } from "./document";

export const experienceTable=pgTable("experience",{
    id:serial("id").notNull().primaryKey(),
    docId:integer("document_id").references(()=>documentTable.id,{
        onDelete:'cascade',
    }),
    title:varchar("title",{length:255}),
    companyName:varchar("company_name",{length:255}),
    city:varchar("city",{length:255}),
    state:varchar("state",{length:255}),
    currentlyWorking:boolean("currently_working").notNull().default(false),
    workSummary:text("work_summary"),
    startDate:date("start_date"),
    endDate:date("end_date"),
})

export const experienceRelations=relations(
    experienceTable,({one})=>({
        document:one(documentTable,{
            fields:[experienceTable.docId],
            references:[documentTable.id]
        })
    })
)