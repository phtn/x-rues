import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatCtx } from "@/ctx/chat-ctx";
import { Icon } from "@/lib/icons";
import { motion } from "motion/react";
import { type ChangeEvent, useCallback } from "react";
import { ImageUpload } from "../image-upload";

export const MessageCtrl = () => {
  const {
    handleImageSelect,
    newMessage,
    setNewMessage,
    sendMessage,
    isLoading,
  } = useChatCtx();

  const handleMessageInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setNewMessage(e.target.value);
    },
    [setNewMessage],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-4 bg-sidebar border-t"
    >
      <div className="flex items-end gap-3">
        <ImageUpload disabled={isLoading} onImageSelect={handleImageSelect} />
        <div className="flex-1">
          <Input
            type="text"
            value={newMessage}
            disabled={isLoading}
            className="resize-none"
            placeholder="Type your message..."
            onChange={handleMessageInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
        <Button
          size="sm"
          className="px-6"
          onClick={sendMessage}
          disabled={isLoading || !newMessage.trim()}
        >
          <Icon name="px-paper-airplane" className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};
