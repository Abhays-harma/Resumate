import { useMutation, useQueryClient } from "@tanstack/react-query"
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useDeleteSkill = () => {
    //const queryClient = useQueryClient()
    //const param = useParams()
    //const documentId = param.documentId

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await client.api.documents.deleteSkill[":id"].$post({
                param: {
                    id: id.toString()
                }
            })
            return await response.json()
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Skill deleted successfully",
                variant: "default",
            });
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            toast({
                title: "Error",
                description: "Failed to delete skill",
                variant: "destructive",
            });
        },
    })
    return mutation
}
export default useDeleteSkill;