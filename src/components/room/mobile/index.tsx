import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ChatListPanel } from "./chat-list-panel";
import { MobileWindow } from "./chat-window";

interface Props {
  selectedChatId: string;
}
export const MobileView = ({ selectedChatId }: Props) => (
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <ChatListPanel />
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <MobileWindow selectedChatId={selectedChatId} />
    </SidebarInset>
  </SidebarProvider>
);
