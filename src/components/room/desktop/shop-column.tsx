"use client";

import Image from "next/image";
import { chatDetailsMedia, chatDetailsFiles, chatDetailsLinks } from "../data";
import { Icon } from "@/lib/icons";
import Link from "next/link";

interface ShopColumnProps {
  onClose: () => void;
}

export function ShopColumn({ onClose }: ShopColumnProps) {
  return (
    <div className="h-[calc(100vh)] w-full overflow-y-scroll p-6 pb-24">
      <div className="mb-6 w-full flex items-center justify-between">
        <h2 className="text-xl flex items-center space-x-3 font-semibold tracking-tighter text-cyber-text-primary">
          <span className="text-cyber-text-primary">Shop</span>
          <Icon solid name="px-zap" className="size-5 text-orange-200/80" />
        </h2>
        <button
          onClick={onClose}
          className="text-cyber-text-secondary hover:text-cyber-red transition-colors"
        >
          <span className="text-lg font-space font-light">42 items</span>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Photos and Videos */}
        <div>
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="text-lg text-white space-x-px flex items-center justify-center italic font-space rounded-sm bg-blue-700 h-7 w-8 aspect-square">
              <span className="font-medium opacity-80 -tracking-widest">
                SH
              </span>
              <span className="font-medium not-italic scale-110">3</span>
            </h3>
            <button className="text-sm text-cyber-text-primary hover:bg-cyber-text-primary flex items-center space-x-2">
              <span>unlock</span>
              <Icon
                solid
                name="px-chevron-right"
                className="size-4 text-cyber-text-secondary"
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {chatDetailsMedia.map((media) => (
              <div
                key={media.id}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={media.url ?? "./rues_v2.svg"}
                  alt="Media"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover aspect-auto opacity-80 hover:opacity-100"
                />
                <span className="absolute bottom-2 right-2 rounded-[6px] bg-black/70 size-7 aspect-square flex items-center justify-center text-xs text-white font-mono">
                  <Icon
                    solid
                    name="px-locked"
                    className="size-5 dark:text-orange-300/80"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Files */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="font-medium text-cyber-text-primary text-xl tracking-tight">
              Level Up Guidelines
            </h3>
            <button className=" font-space font-light flex items-center space-x-2 tracking-tight">
              <span className="text-cyber-text-primary">read all</span>
              <Icon
                solid
                name="px-chevron-right"
                className="size-4 text-cyber-text-secondary"
              />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {chatDetailsFiles.map((file) => (
              <div
                key={file.id}
                className="h-20 flex items-center gap-4 rounded-xl bg-cyber-card p-4 border border-cyber-border"
              >
                <Icon solid name="px-file" className="size-5 text-orange-300" />
                <div className="flex flex-col">
                  <span className="text-sm text-cyber-text-primary">
                    {file.name}
                  </span>
                  <span className="text-xs text-cyber-text-secondary truncate">
                    {file.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Links */}
        <div className="my-6">
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="font-medium text-cyber-text-primary text-xl tracking-tight">
              Media & Other Digital Products
            </h3>
            <button className=" font-space font-light flex items-center space-x-2 tracking-tight">
              <span className="text-cyber-text-primary">buy now</span>
              <Icon
                solid
                name="px-chevron-right"
                className="size-4 text-cyber-text-secondary"
              />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {chatDetailsLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-20 flex items-center gap-4 rounded-xl bg-card p-4 border border-cyber-panel hover:bg-cyber-card/80 transition-colors"
              >
                <Icon solid name="px-link" className="size-6 text-teal-500" />
                <div className="flex flex-col">
                  <span className="text-sm text-cyber-text-primary">
                    {link.name}
                  </span>
                  <span className="text-xs text-cyber-text-secondary truncate">
                    {link.url}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
