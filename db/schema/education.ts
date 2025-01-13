import { date, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { relations } from "drizzle-orm";

export const educationTable=pgTable("education",{
    id:serial("id").notNull().primaryKey(),
    docId:integer("document_id").references(()=>documentTable.id,{
        onDelete:'cascade'
    }),
    universityName:varchar("university_name",{length:255}),
    degree:varchar("degree",{length:255}),
    major:varchar("major",{length:255}),
    description:text("description"),
    startDate:date("start_date"),
    endDate:date("end_date"),
})

export const educationRelations=relations(
    educationTable,({one})=>({
        document:one(documentTable,{
            fields:[educationTable.docId],
            references:[documentTable.id],
        })
    })
)