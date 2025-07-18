"use client";

import {} from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/lib/icons";
import { IconName } from "@/lib/icons/types";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
interface SecretItem {
  id: string;
  name: string;
  icon: IconName;
  tab: string;
}
export function DesktopSidebar({
  activeTab,
  onTabChange,
}: DesktopSidebarProps) {
  const secretNavItems = [
    { id: "0", name: "Drugs", icon: "ga-pill", tab: "drugs" },
    { id: "1", name: "Guns", icon: "ga-uzi", tab: "guns" },
    { id: "2", name: "Escorts", icon: "ga-escort", tab: "escorts" },
  ] as SecretItem[];

  return (
    <div className="flex h-screen w-24 flex-shrink-0 flex-col items-center justify-between bg-cyber-sidebar py-6">
      <div className="text-3xl font-bold text-cyber-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
        <div className="flex items-center justify-center">
          <Icon
            solid
            name="ga-anarchy"
            className="size-6 md:size-12 text-cyber-blue"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-8">
        {secretNavItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={cn(
              "flex flex-col items-center gap-2.5 text-cyber-text-secondary transition-colors duration-200",
              "hover:text-cyber-blue drop-shadow-[0_0_4px_rgba(0,240,255,0.4)]",
              activeTab === item.tab &&
                "text-cyber-blue drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]",
            )}
          >
            <Icon
              solid
              name={item.icon}
              className="size-5 md:size-9 text-cyber-blue"
            />
            <span className="text-sm font-medium text-cyber-text-primary">
              {item.name}
            </span>
          </button>
        ))}
      </nav>
      <button
        onClick={() => onTabChange("settings")}
        className={cn(
          "flex flex-col items-center gap-1 text-cyber-text-secondary transition-colors duration-200",
          "hover:text-cyber-blue hover:drop-shadow-[0_0_4px_rgba(0,240,255,0.4)]",
          activeTab === "settings" &&
            "text-cyber-blue drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]",
        )}
      >
        <Icon name="asterisk" className="size-7" />
        <span className="text-xs font-medium">Settings</span>
      </button>
    </div>
  );
}
