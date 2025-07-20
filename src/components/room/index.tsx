"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { users } from "./data";
// import { MobileView } from "./mobile";
import { DesktopView } from "./desktop";

export const DarkRoom = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [selectedChatId, setSelectedChatId] = useState("");

  // Set initial selected chat based on mode
  useEffect(() => {
    if (isDesktop && users[5]) {
      setSelectedChatId(users[5].id); // Harry Fettel for desktop
    } else {
      setSelectedChatId("2"); // Marie Wondy for mobile
    }
  }, [isDesktop]);

  return (
    <DesktopView
      selectedChatId={selectedChatId}
      setSelectedChatId={setSelectedChatId}
    />
  );

  // return <MobileView selectedChatId={selectedChatId || users[2].id} />;
};
