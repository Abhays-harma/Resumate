import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Loader, MoreHorizontal, Redo, Trash2 } from "lucide-react";
import { StatusType } from "@/types/resume.type";
import { useResumeInfoContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/use-update-document";

const MoreOption = () => {
  const router = useRouter();
  const { resumeInfo, isLoading, onUpdate } = useResumeInfoContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  const handleClick = useCallback(
    async (status: StatusType) => {
      if (!resumeInfo) return;
      await mutateAsync(
        {
          status: status,
        },
        {
          onSuccess: () => {
            onUpdate({
              ...resumeInfo,
              status: status,
            });
            router.replace(`/dashboard/documents`);
            toast({
              title: "Success",
              description: `Moved to trash successfully`,
            });
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update status",
              variant: "destructive",
            });
          },
        }
      );
    },
    [mutateAsync, onUpdate, resumeInfo, router]
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={resumeInfo?.status === 'archived' ? true : false || isLoading}
            variant="secondary"
            size="icon"
            className="bg-white border
             dark:bg-gray-800"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            {resumeInfo?.status === "archived" ? (
              <Button
                variant="ghost"
                className="gap-1 !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("private")}
              >
                <Redo size="15px" />
                Retore resume
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="gap-1  !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("archived")}
              >
                <Trash2 size="15px" />
                Move to Trash
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MoreOption;