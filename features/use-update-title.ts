import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation"
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { toast } from "@/hooks/use-toast";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useUpdateTitle=()=>{
    const param=useParams()
    const documentId=param.documentId as string;

    const mutation=useMutation({
        mutationFn:async(json:{newTitle:string})=>{
            const reponse=await client.api.documents.updateTitle[":documentId"].$post({
                param:{
                    documentId:documentId,
                },
                json
            })
        },
        onSuccess:()=>{
            toast({
                title:'Success',
                description:'Updated title successfully',
            })
        },
        onError:()=>{
            toast({
                title:'Error',
                description:'Error in updating title',
            })
        }
    })
    return mutation;
}

export default useUpdateTitle;