"use client";

import { HyperList } from "@/components/hyper";
import { RoundCard } from "@/components/hyper/round-card";
import { useChatRoom } from "@/hooks/use-chatroom";
import { useMemo } from "react";
import { useChatCtx } from "@/ctx/chat-ctx";

export const Lobby = () => {
  const { isLoading, currentUser, loginUser, error } = useChatCtx();

  const { MOCK_USERS } = useChatRoom();

  const data = useMemo(() => {
    const allUsers = MOCK_USERS.map((e) => ({
      ...e,
      fn: loginUser,
    }));
    if (currentUser) {
      return allUsers.filter((user) => user.id !== currentUser.id);
    }
    return allUsers;
  }, [MOCK_USERS, loginUser, currentUser]);

  return (
    <main className="">
      <div className="h-32"></div>
      <div className="relative z-20">
        <h2 className="font-sans text-center h-20 text-2xl tracking-tighter">
          Select your Avatar
        </h2>
        <div className="flex justify-evenly gap-8">
          <HyperList
            container="flex gap-10 p-4"
            direction="right"
            data={data}
            component={RoundCard}
          />
        </div>
        {isLoading && (
          <p
            style={{ textAlign: "center", marginTop: "16px", color: "#cbd5e1" }}
          >
            generating ephemeral keys
          </p>
        )}
        {error && (
          <p className="text-orange-300 text-center text-lg h-12">
            {error.message}
          </p>
        )}
      </div>
    </main>
  );
};
