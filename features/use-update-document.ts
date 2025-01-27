import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation"
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { UpdateDocumentSchema } from "@/db/schema/document";
import { toast } from "@/hooks/use-toast";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);


const useUpdateDocument=()=>{
    const param=useParams()
    const documentId=param.documentId as string;

    const muation=useMutation({
        mutationFn: async (json:UpdateDocumentSchema)=>{
            console.log('Entered in useUpdateDocument');
            const response=await client.api.documents.update[":documentId"].$post({
                param:{
                    documentId:documentId,
                },
                json,
            })
            console.log('response is : ',response)
            return await response.json()
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({
        //       queryKey: ["document", documentId],
        //     });
        //   },
        onError:()=>{
            toast({
                title:'Error',
                description:'Failed to update document',
                variant:'destructive'
            })
        }
    })
    return muation;
}

export default useUpdateDocument;