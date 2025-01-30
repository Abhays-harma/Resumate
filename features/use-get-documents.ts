'use client'
import { useQuery } from "@tanstack/react-query"
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useGetDocuments = () => {
    const queryKey = ['documents']
    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response=await client.api.documents.all.$get()
            if(!response.ok){
                throw new Error('Failed to get documents')
            }
            return await response.json()
        }
    })
    return query;
}
export default useGetDocuments;