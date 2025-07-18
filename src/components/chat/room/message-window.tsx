import { type ReactNode } from "react";
import { IOriginalSidebar, OriginalSidebar } from "./original-sidebar";

interface Props {
  sidebarProps: IOriginalSidebar;
  children: ReactNode;
}
export const MessageWindow = ({ sidebarProps, children }: Props) => {
  return (
    <div className="flex h-[calc(100vh-54px)]">
      <OriginalSidebar {...sidebarProps} />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
};
