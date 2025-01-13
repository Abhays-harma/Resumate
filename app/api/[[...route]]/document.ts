import { Hono } from "hono";
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { getAuthUser } from "@/lib/kinde";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/db";
import { documentTable } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

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
                    success:true,
                    data:documents,
                },200)
            } catch (error) {
                return c.json({
                    success:false,
                    message:error,
                },500)
            }
        }
    )
    .get(
        '/:documentId',
        zValidator('param',
            z.object({
                documentId:z.string(),
            })
        ),
        getAuthUser,
        async (c)=>{
            try {
                const user=c.get('user')
                const userId=user?.id
                const {documentId}=c.req.valid('param')
    
                const documentData=await db.query.documentTable.findFirst({
                    where: and(
                        eq(documentTable.userId,userId),
                        eq(documentTable.documentId,documentId),
                    ),
                    with:{
                        personalInfo:true,
                        experiences:true,
                        educations:true,
                        skills:true,
                    }
                })
                return c.json({
                    success:true,
                    data:documentData,
                },200)
            } catch (error) {
                return c.json({
                    success:false,
                    message:"Failed to fetch document",
                    error:error,
                },500)
            }
        }
    )

export default documentRoute;