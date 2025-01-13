"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AppType from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

const useCreateDocument = () => {
  const mutation = useMutation({
    mutationFn: async (json:{title:string}) => {
      const response = await client.api.documents.create.$post({ json });
      return await response.json();
    },
    onSuccess: (response) => {
      console.log("Response received:", response);
      toast({
        title: "Success",
        description: "Document created successfully",
        variant:'default'
        
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useCreateDocument;
