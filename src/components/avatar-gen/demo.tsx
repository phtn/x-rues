"use client";

import { useState } from "react";
import { CyberAvatar } from "./gen";

export const AvatarDemo = () => {
  const [userId, setUserId] = useState("user123");
  // const { avatarSvg, setKey, downloadAvatar } = useAvatarGenerator(userId);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Cyberpunk Avatar Examples</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">1. Full Avatar Generator</h3>
        <CyberAvatar publicKey="demo-user" />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">2. Simple Avatar Display</h3>
        {/* <div className="flex flex-wrap gap-4">
          <Avatar publicKey="user1" size={80} />
          <Avatar publicKey="user2" size={80} />
          <Avatar publicKey="user3" size={80} />
          <Avatar publicKey="user4" size={80} />
        </div> */}
      </div>
    </div>
  );
};

export default AvatarDemo;
