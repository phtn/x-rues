import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/icons";
import { motion } from "motion/react";
import { IChatRoom } from "../types";

interface Props {
  handleBackToRooms: VoidFunction;
  activeRoomData: IChatRoom;
  logoutFn: VoidFunction;
}
export const RoomHeader = ({
  handleBackToRooms,
  activeRoomData,
  logoutFn,
}: Props) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border-b p-4 flex justify-between items-center"
  >
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        onClick={handleBackToRooms}
        className="flex items-center gap-2"
      >
        <Icon
          solid
          name="px-arrow-up"
          className="size-7 -rotate-90 text-neutral-500"
        />
      </Button>
      <div>
        <h1 className="text-xl font-medium font-space tracking-tighter text-neutral-500">
          {activeRoomData?.name}
        </h1>
      </div>
      <div className="flex items-center px-4 gap-8 font-semibold font-space">
        <div className="flex items-center gap-2 text-neutral-500">
          <Icon solid name="px-user" className="size-5" />
          <span className="text-lg">{activeRoomData?.members.length}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <Icon solid name="px-chat" className="size-5" />
          <span className="text-lg">{activeRoomData?.messages.length}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={logoutFn}
        className="shadow-none rounded-sm"
      >
        <Icon
          solid
          name="px-more-horizontal"
          className="size-5 text-neutral-500"
        />
      </Button>
    </div>
  </motion.div>
);
