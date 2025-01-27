import { Hono } from "hono";
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { getAuthUser } from "@/lib/kinde";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/db";
import { documentTable, educationTable, experienceTable, personalInfoTable, skillsTable } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { updateSchema } from "@/db/schema/document";

const documentRoute = new Hono()
    .post(
        '/create',
        zValidator("json",
            z.object({
                title: z.string(),
            })
        ),
        getAuthUser,
        async (c) => {
            try {
                const user = c.get('user')
                const userId = user?.id
                const { title } = c.req.valid("json")
                const authorName = `${user?.given_name} ${user?.family_name}`
                const authorEmail = user?.email as string
                const documentId = uuidv4()

                const newDoc = {
                    title: title,
                    userId: userId,
                    documentId: documentId,
                    authorName: authorName,
                    authorEmail: authorEmail,
                }

                const [data] = await db.insert(documentTable).values(newDoc).returning()
                return c.json({
                    success: true,
                    data,
                }, 200)
            } catch (error) {
                return c.json({
                    success: false,
                    message: error
                }, 500)
            }
        }
    )
    .post(
        '/update/:documentId',
        zValidator('param', z.object({
            documentId: z.string(),
        })),
        zValidator('json', updateSchema),
        getAuthUser,
        async (c) => {
            try {
                console.log("Entered update route");
                
                const user = c.get('user')
                const userId = user?.id
                const { documentId } = c.req.valid('param')
                const {
                    title,
                    status,
                    summary,
                    thumbnail,
                    themeColor,
                    currentPosition,
                    personalInfo,
                    experience,
                    education,
                    skills,
                } = c.req.valid('json')
                if (!documentId) {
                    return c.json({
                        success: false,
                        message: 'DocumentId is required',
                    }, 400)
                }

                const [existingDocument] = await db.select().from(documentTable)
                    .where(
                        and(
                            eq(documentTable.documentId, documentId),
                            eq(documentTable.userId, userId),
                        )
                    )
                if (!existingDocument) {
                    return c.json({
                        success: false,
                        message: 'Document not found',
                    }, 404)
                }
                //updating the document table

                const resumeUpdate = {
                    title: title,
                    thumbnail: thumbnail,
                    summary: summary,
                    themeColor: themeColor,
                    status: status,
                    currentPosition: currentPosition || 1,
                }
                if (Object.keys(resumeUpdate)?.length > 0) {
                    await db.update(documentTable).set(resumeUpdate)
                        .where(
                            and(
                                eq(documentTable.documentId, documentId),
                                eq(documentTable.userId, userId),
                            )
                        )
                }

                // Updating or inserting personalInfo
                if (personalInfo) {
                    //todo:check by movong exists in square brackets if it works to update
                    const exists = await db
                        .select()
                        .from(personalInfoTable)
                        .where(
                            eq(personalInfoTable.docId, existingDocument.id),
                        )
                    if (exists.length > 0) {
                        await db
                            .update(personalInfoTable)
                            .set(personalInfo)
                            .where(eq(personalInfoTable.docId, existingDocument.id))
                    } else {
                        await db.insert(personalInfoTable)
                            .values({
                                docId: existingDocument.id,
                                ...personalInfo,
                            })
                    }
                }

                //updating or inserting experience
                if (experience && Array.isArray(experience)) {
                    const existingExperience = await db
                        .select()
                        .from(experienceTable)
                        .where(
                            eq(experienceTable.docId,
                                existingDocument.id
                            ),
                        )
                    const existingExperienceMap = new Set(
                        existingExperience.map((exp) => exp.id)
                    )

                    for (const exp of experience) {
                        const { id, ...data } = exp;
                        if (id !== undefined && existingExperienceMap.has(id)) {
                            await db
                                .update(experienceTable)
                                .set(data)
                                .where(
                                    and(
                                        eq(experienceTable.docId, existingDocument.id),
                                        eq(experienceTable.id, id),
                                    )
                                )
                        } else {
                            await db.insert(experienceTable).values({
                                docId: existingDocument.id,
                                ...data,
                            })
                        }
                    }
                }

                //updating or inserting education
                if (education && Array.isArray(education)) {
                    const existingEducation = await db
                        .select()
                        .from(educationTable)
                        .where(
                            eq(educationTable.docId, existingDocument.id)
                        )
                    const existingEducationMap = new Set(
                        existingEducation.map((edu) => edu.id)
                    )
                    for (const edu of education) {
                        const { id, ...data } = edu;
                        if (id !== undefined && existingEducationMap.has(id)) {
                            await db
                                .update(educationTable)
                                .set(data)
                                .where(
                                    and(
                                        eq(educationTable.docId,
                                            existingDocument.id),
                                        eq(educationTable.id, id)
                                    )
                                )
                        } else {
                            await db.insert(educationTable).values({
                                docId: existingDocument.id,
                                ...data,
                            })
                        }
                    }
                }

                //updating or inserting skills

                if (skills && Array.isArray(skills)) {
                    const existingSkills = await db
                        .select()
                        .from(skillsTable)
                        .where(eq(skillsTable.docId, existingDocument.id));

                    const existingSkillsMap = new Set(
                        existingSkills.map((skill) => skill.id)
                    )

                    for (const skill of skills) {
                        const { id, ...data } = skill
                        if (id !== undefined && existingSkillsMap.has(id)) {
                            await db
                                .update(skillsTable)
                                .set(data)
                                .where(
                                    and(
                                        eq(skillsTable.docId, existingDocument.id),
                                        eq(skillsTable.id, id),
                                    )
                                )
                        } else {
                            await db.insert(skillsTable).values({
                                docId: existingDocument.id,
                                ...data,
                            })
                        }
                    }
                }

                return c.json({
                    success: true,
                    message: 'Updated Successfully',
                }, 200)


            } catch (error) {
                console.log("Error in update route", error);

                return c.json({
                    success: false,
                    message: 'Failed to update document',
                }, 500)
            }
        }
    )
    .get(
        '/all',
        getAuthUser,
        async (c) => {
            try {
                const user = c.get('user')
                const userId = user?.id

                const documents = await db.select()
                    .from(documentTable)
                    .where(
                        and(
                            eq(documentTable.userId, userId),
                            ne(documentTable.status, 'archived')
                        )
                    )

                return c.json({
                    success: true,
                    data: documents,
                }, 200)
            } catch (error) {
                return c.json({
                    success: false,
                    message: error,
                }, 500)
            }
        }
    )
    .get(
        '/:documentId',
        zValidator('param',
            z.object({
                documentId: z.string(),
            })
        ),
        getAuthUser,
        async (c) => {
            try {
                const user = c.get('user')
                const userId = user?.id
                const { documentId } = c.req.valid('param')

                const documentData = await db.query.documentTable.findFirst({
                    where: and(
                        eq(documentTable.userId, userId),
                        eq(documentTable.documentId, documentId),
                    ),
                    with: {
                        personalInfo: true,
                        experiences: true,
                        educations: true,
                        skills: true,
                    }
                })
                return c.json({
                    success: true,
                    data: documentData,
                }, 200)
            } catch (error) {
                return c.json({
                    success: false,
                    message: "Failed to fetch document",
                    error: error,
                }, 500)
            }
        }
    )
    .get('/experiences/:documentId',
        zValidator('param',
            z.object({
                documentId: z.string(),
            })
        ),
        getAuthUser,
        async (c) => {
            try {
                const { documentId } = c.req.valid('param')

                const [document] = await db
                    .select()
                    .from(documentTable)
                    .where(eq(documentTable.documentId, documentId))
                    .limit(1)

                const id = document?.id;

                const experiences = await db
                    .select()
                    .from(experienceTable)
                    .where(
                        eq(experienceTable.docId, id)
                    )

                return c.json({
                    experiences,
                    success: true,
                }, 200)
            } catch (error) {
                return c.json({
                    success: false,
                    message: error
                }, 500)
            }
        }
    )
    .get('/educations/:documentId',
        zValidator('param', z.object({
            documentId: z.string(),
        })),
        getAuthUser,
        async (c) => {
            try {
                const {documentId}=c.req.valid('param')
    
                const [document]=await db.select()
                                    .from(documentTable)
                                    .where(eq(documentTable.documentId,documentId))
                                    .limit(1)
                const id=document?.id;
    
                const educations=await db.select()
                                    .from(educationTable)
                                    .where(eq(educationTable.docId,id))
                return c.json({
                    educations,
                    success:true,
                },200)
            } catch (error) {
                return c.json({
                    success:false,
                    message:error,
                },500)
            }
        }
    )
    .get('/skills/:documentId',
        zValidator('param', z.object({
            documentId: z.string(),
        })),
        getAuthUser,
        async (c) => {
            try {
                const {documentId}=c.req.valid('param')
    
                const [document]=await db.select()
                                    .from(documentTable)
                                    .where(eq(documentTable.documentId,documentId))
                                    .limit(1)
                const id=document?.id;
    
                const skills=await db.select()
                                    .from(skillsTable)
                                    .where(eq(skillsTable.docId,id))
                return c.json({
                    skills,
                    success:true,
                },200)
            } catch (error) {
                return c.json({
                    success:false,
                    message:error,
                },500)
            }
        }
    )
    .post(
        '/deleteExperience/:id',
        zValidator('param', z.object({
            id: z.coerce.number(),
        })),
        getAuthUser,
        async (c) => {
            try {
                const { id } = c.req.valid('param')

                await db.delete(experienceTable)
                    .where(
                        eq(experienceTable.id, id)
                    )
                return c.json({
                    success: true,
                }, 200)
                
            } catch (error) {
                return c.json({
                    success: false,
                    message: error,
                }, 500)
            }
        }
    )
    .post('/deleteEducation/:id',
        zValidator('param',z.object({
            id:z.coerce.number()
        })),
        getAuthUser,
        async (c) => {
            try {
                const { id } = c.req.valid('param')

                await db.delete(educationTable)
                    .where(
                        eq(educationTable.id, id)
                    )
                return c.json({
                    success: true,
                }, 200)
                
            } catch (error) {
                return c.json({
                    success: false,
                    message: error,
                }, 500)
            }
        }
    )
    .post('/deleteSkill/:id',
        zValidator('param',z.object({
            id:z.coerce.number()
        })),
        getAuthUser,
        async (c) => {
            try {
                const { id } = c.req.valid('param')

                await db.delete(skillsTable)
                    .where(
                        eq(skillsTable.id, id)
                    )
                return c.json({
                    success: true,
                }, 200)
                
            } catch (error) {
                return c.json({
                    success: false,
                    message: error,
                }, 500)
            }
        }
    )
    .post('/updateTitle/:documentId',
        zValidator('param',z.object({
            documentId:z.string(),
        })),
        zValidator('json',z.object({
            newTitle:z.string(),
        })),
        getAuthUser,
        async (c)=>{
            try {
                const {documentId}=c.req.valid('param')
                const {newTitle}=c.req.valid('json')
                await db.update(documentTable)
                    .set({title:newTitle})
                    .where(eq(documentTable.documentId,documentId))
                return c.json({
                    success:true,
                },200)
            } catch (error) {
                return c.json({
                    success:false,
                    error:error,
                },500)
            }
        }
    )

export default documentRoute;