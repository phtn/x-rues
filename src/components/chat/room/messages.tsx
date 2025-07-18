import { AnimatePresence, motion } from "motion/react";
import { type RefObject } from "react";
import { type Ver } from "../image-message";
import { ChatBubble } from "../message-bubble";
import { type Message } from "../types";

interface Props {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  userId: string;
  decryptMessage: (message: Message | Ver) => Promise<string>;
}
export const Messages = ({
  messages,
  messagesEndRef,
  userId,
  decryptMessage,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full p-4 overflow-y-scroll space-y-4"
    >
      <AnimatePresence>
        {messages?.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <ChatBubble
              message={message}
              currentUserId={userId}
              decryptMessage={decryptMessage}
              isOwn={message.senderId === userId}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </motion.div>
  );
};
