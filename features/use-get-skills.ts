import { useQuery } from "@tanstack/react-query"; import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { useParams } from "next/navigation";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useGetSkills = () => {
    const param = useParams();
    const documentId = param.documentId as string

    const query = useQuery({
        queryKey: ['skills', documentId],
        queryFn: async () => {
            const response = await client.api.documents.skills[":documentId"].$get({
                param: {
                    documentId: documentId,
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch experiences')
            }

            return await response.json();
        }
    })
    return query
}

export default useGetSkills;