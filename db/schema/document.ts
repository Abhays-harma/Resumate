import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { personalInfoTable } from "./personal-info";
import { experienceTable } from "./experience";
import { educationTable } from "./education";
import { skillsTable } from "./skills";
import { z } from "zod";

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
    thumbnail: text("thumbnail"),
})


export const documentRelations = relations(
    documentTable, ({ one, many }) => ({
        personalInfo: one(personalInfoTable),
        experiences: many(experienceTable),
        educations: many(educationTable),
        skills: many(skillsTable),
    })
)

export const updateSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    status: z.enum(['archived', 'private', 'public']).optional(),
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    themeColor: z.string().min(7, 'Hex code must be valid').optional(),
    currentPosition: z.number().int().min(1).optional(),
    personalInfo: z.object({
        firstName: z.string().min(1, 'First Name should not be empty').optional(),
        lastName: z.string().optional(),
        jobTitle: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
    }).optional(),
    experience: z.array(z.object({
        id:z.number().optional(),
        title: z.string().min(1, 'Title cannot be empty').optional(),
        companyName: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        currentlyWorking: z.boolean().optional(),
        workSummary: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
        id:z.number().optional(),
        universityName: z.string().min(1, "University name cannot be empty").optional(),
        degree: z.string().optional(),
        major: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    })).optional(),
    skills: z.array(z.object({
        id:z.number().optional(),
        name: z.string().min(1, "Skill name cannot be empty").optional(),
        rating: z.number().min(0).max(5).optional(),
    })).optional(),
})

export type UpdateDocumentSchema=z.infer<typeof updateSchema>;
