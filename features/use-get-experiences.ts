import { useQuery } from "@tanstack/react-query"
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { useParams } from "next/navigation";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useGetExperiences = () => {
    const param=useParams()
    const documentId=param.documentId as string

    const queryKey = ['experiences',documentId]
    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response=await client.api.documents.experiences[":documentId"].$get({
                param:{
                    documentId:documentId,
                }
            })
            if(!response.ok){
                throw new Error('Failed to fetch experiences')
            }
            // const data=await response.json()
            // console.log("experiences : ",data);
            return await response.json();
        }
    })
    return query;
}
export default useGetExperiences;