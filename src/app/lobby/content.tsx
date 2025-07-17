"use client";

import { RoundCard } from "@/components/hyper/round-card";
import { useChatRoom } from "@/hooks/use-chatroom";
import { useMemo, useState, useCallback } from "react";
import { useChatCtx } from "@/ctx/chat-ctx";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/lib/icons";

export const Content = () => {
  const { isLoading, currentUser, loginUser, error } = useChatCtx();
  const { MOCK_USERS } = useChatRoom();
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAvatarSelect = useCallback(
    async (userId: string) => {
      console.log(userId);
      setSelectedAvatar(userId);

      // Wait for the transition animation to complete before starting login
      setTimeout(async () => {
        setIsTransitioning(true);

        try {
          // Start the login process
          await loginUser(userId);

          // After successful login, set cookie and navigate to chat rooms
          setTimeout(() => {
            // Set userId in cookie (this will be used by middleware)
            document.cookie = `userId=${userId}; path=/; max-age=86400; SameSite=Strict`;
            router.push(`/lobby/${userId}/rooms`);
          }, 1500);
        } catch (error) {
          // If login fails, reset the transition state
          console.error(error);
          setIsTransitioning(false);
          setSelectedAvatar(null);
        }
      }, 800); // Wait for the center transition to complete
    },
    [loginUser, router],
  );

  const data = useMemo(() => {
    const allUsers = MOCK_USERS.map((e) => ({
      ...e,
      fn: handleAvatarSelect,
    }));
    if (currentUser) {
      return allUsers.filter((user) => user.id !== currentUser.id);
    }
    return allUsers;
  }, [MOCK_USERS, handleAvatarSelect, currentUser]);

  const selectedUser = useMemo(
    () => MOCK_USERS.find((user) => user.id === selectedAvatar),
    [MOCK_USERS, selectedAvatar],
  );

  if (isTransitioning && selectedUser) {
    return (
      <main className="h-screen flex items-start pt-24 justify-center">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="bg-neutral-200/20 w-56 h-64 md:w-96 md:h-96 overflow-hidden flex flex-col items-center justify-center rounded-3xl space-y-8 md:space-y-8"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <RoundCard {...selectedUser} fn={() => {}} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center space-y-8 bg-transparent"
            >
              <h2 className="font-sans justify-center md:text-2xl tracking-tighter flex items-center space-x-2">
                <span>Signing in</span>
                <Icon name="spinners-ring" className="md:size-6 size-3" />
              </h2>
              <div className="flex flex-col items-center space-y-2">
                <p className="font-mono font-normal text-[10px] md:text-sm">
                  {isLoading
                    ? "Generating ephemeral keys..."
                    : "Preparing your secure session..."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main
      className={cn(
        "h-screen flex items-center justify-center relative overflow-hidden",
        { " pb-96": !isTransitioning },
      )}
    >
      <div className="flex flex-col items-center space-y-10 md:space-y-16">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: selectedAvatar ? 0 : 1,
            y: selectedAvatar ? 40 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:text-4xl text-xl font-medium tracking-tighter text-center"
        >
          Select your Avatar
        </motion.h2>

        {/* Avatars Container */}
        <div className="w-fit flex justify-center items-center md:w-full gap-4 lg:gap-16 relative">
          {data.map((user, index) => {
            const isSelected = user.id === selectedAvatar;
            const isLeft = index === 0;
            const isRight = index === 2;

            return (
              <motion.div
                key={user.id}
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.8,
                }}
                animate={{
                  opacity: selectedAvatar && !isSelected ? 0 : 1,
                  y: 0,
                  scale: isSelected
                    ? 1.2
                    : selectedAvatar && !isSelected
                      ? 0.6
                      : 1,
                  x:
                    selectedAvatar && !isSelected
                      ? isLeft
                        ? -100
                        : isRight
                          ? 100
                          : 0
                      : 0,
                  zIndex: isSelected ? 10 : 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth easing
                  delay: selectedAvatar ? 0 : index * 0.15,
                }}
                whileHover={
                  !selectedAvatar
                    ? {
                        scale: 1.08,
                        y: -5,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }
                    : {}
                }
                className="cursor-pointer relative"
              >
                <RoundCard {...user} />
              </motion.div>
            );
          })}
        </div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-16"
            >
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-destructive font-medium text-center">
                  {error.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};
