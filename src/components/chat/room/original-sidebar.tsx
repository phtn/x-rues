import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useCallback } from "react";
import { type User } from "../types";

export interface IOriginalSidebar {
  members: User[];
  onMemberSelect: (member: User) => void;
  creator: string | undefined;
  withPermission: (userId: string) => boolean;
}
export const OriginalSidebar = ({
  creator,
  members,
  withPermission,
  onMemberSelect,
}: IOriginalSidebar) => {
  const handleConfigUser = useCallback(
    (user: User) => () => onMemberSelect(user),
    [onMemberSelect],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="w-80 border-r bg-sidebar space-y-6 overflow-y-auto"
    >
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className={`cursor-pointer py-3 px-1 hover:bg-muted/50 border-b-[0.33px]`}
            onClick={handleConfigUser(member)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {member.id === creator && (
                  <div className="h-10 w-16 flex items-center justify-center">
                    <Icon
                      solid
                      name="px-ship"
                      className="size-7 text-amber-500"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="font-semibold font-sans">{member.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.id === creator && "Room Creator"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Icon
                  solid
                  name={withPermission(member.id) ? "px-check" : "px-close"}
                  className={cn("size-6 text-orange-300", {
                    "text-neutral-800": withPermission(member.id),
                  })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
