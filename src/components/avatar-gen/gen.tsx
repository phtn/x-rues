"use client";

import { ClassName } from "@/app/types";
import { generateAvatar, randomHash } from "./generator";
import { useState } from "react";
import { useEffectAvatar } from "./use-effect";
import { cn } from "@/lib/utils";

interface Props {
  publicKey: string;
  className?: ClassName;
  size?: number;
}
export const CyberAvatar = ({ publicKey, className, size = 120 }: Props) => {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffectAvatar(() => {
    const avatarSvg = publicKey
      ? generateAvatar(publicKey)
      : generateAvatar(randomHash());

    if (avatarSvg) {
      setSvgContent(avatarSvg);
    }
  });

  return (
    <div className="">
      {/* <div className={`cyber-avatar-wrapper ${className}`}> */}
      <div
        className={cn("cyber-avatar shrink", className)}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {/* </div> */}
    </div>
  );
};
