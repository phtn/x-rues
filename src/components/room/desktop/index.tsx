import { ShopColumn } from "@/components/room/desktop/shop-column";
import { ScrollArea } from "@/components/ui/scroll-area"; // Ensure ScrollArea is imported
import { Icon } from "@/lib/icons";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DesktopChatList } from "./desktop-chat-list";
import { DesktopWindow } from "./desktop-window";
// import { DesktopSidebar } from "./desktop-sidebar";

interface Props {
  selectedChatId: string;
  setSelectedChatId: Dispatch<SetStateAction<string>>;
}

const DEFAULT_CHAT_LIST_WIDTH = 384; // w-96 in px
const DEFAULT_CHAT_DETAILS_WIDTH = 384; // w-96 in px
const MIN_PANEL_WIDTH = 200; // Minimum width for a panel when not collapsed
const COLLAPSED_WIDTH = 0; // Width when collapsed

export const DesktopView = (props: Props) => {
  const { selectedChatId, setSelectedChatId } = props;

  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false);
  const [isChatDetailsCollapsed, setIsChatDetailsCollapsed] = useState(false);

  // const [activeDesktopTab, setActiveDesktopTab] = useState("chats");

  const [chatListWidth, setChatListWidth] = useState(DEFAULT_CHAT_LIST_WIDTH);
  const [chatDetailsWidth, setChatDetailsWidth] = useState(
    DEFAULT_CHAT_DETAILS_WIDTH,
  );
  const resizingRef = useRef<{
    isResizing: boolean;
    startClientX: number;
    initialChatListWidth: number;
    initialChatDetailsWidth: number;
    panelToResize: "chatList" | "chatDetails" | null;
  }>({
    isResizing: false,
    startClientX: 0,
    initialChatListWidth: 0,
    initialChatDetailsWidth: 0,
    panelToResize: null,
  });

  const toggleChatListCollapse = useCallback(() => {
    setIsChatListCollapsed((prev) => {
      if (prev) {
        setChatListWidth(DEFAULT_CHAT_LIST_WIDTH); // Expand to default
      } else {
        setChatListWidth(COLLAPSED_WIDTH); // Collapse
      }
      return !prev;
    });
  }, []);

  const toggleChatDetailsCollapse = useCallback(() => {
    setIsChatDetailsCollapsed((prev) => {
      if (prev) {
        setChatDetailsWidth(DEFAULT_CHAT_DETAILS_WIDTH); // Expand to default
      } else {
        setChatDetailsWidth(COLLAPSED_WIDTH); // Collapse
      }
      return !prev;
    });
  }, []);

  const startResizing = useCallback(
    (e: React.MouseEvent, panel: "chatList" | "chatDetails") => {
      resizingRef.current = {
        isResizing: true,
        startClientX: e.clientX,
        initialChatListWidth: chatListWidth,
        initialChatDetailsWidth: chatDetailsWidth,
        panelToResize: panel,
      };
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [chatListWidth, chatDetailsWidth],
  );

  const stopResizing = useCallback(() => {
    resizingRef.current.isResizing = false;
    resizingRef.current.panelToResize = null;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!resizingRef.current.isResizing) return;

    const dx = e.clientX - resizingRef.current.startClientX;
    const { panelToResize, initialChatListWidth, initialChatDetailsWidth } =
      resizingRef.current;

    if (panelToResize === "chatList") {
      let newWidth = initialChatListWidth + dx;
      if (newWidth < MIN_PANEL_WIDTH) newWidth = MIN_PANEL_WIDTH;
      setChatListWidth(newWidth);
      setIsChatListCollapsed(false); // Uncollapse if resizing
    } else if (panelToResize === "chatDetails") {
      let newWidth = initialChatDetailsWidth - dx;
      if (newWidth < MIN_PANEL_WIDTH) newWidth = MIN_PANEL_WIDTH;
      setChatDetailsWidth(newWidth);
      setIsChatDetailsCollapsed(false); // Uncollapse if resizing
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-cyber-bg text-cyber-blue">
      {/* Sidebar */}
      {/* <DesktopSidebar
        activeTab={activeDesktopTab}
        onTabChange={setActiveDesktopTab}
      /> */}

      {/* Chat List Panel */}
      <div
        className="relative flex flex-shrink-0 flex-col bg-cyber-panel p-6 transition-all duration-200 ease-in-out"
        style={{
          width: isChatListCollapsed ? COLLAPSED_WIDTH : chatListWidth,
        }}
      >
        {!isChatListCollapsed && (
          <ScrollArea className="flex-1 pr-2">
            <DesktopChatList
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
            />
          </ScrollArea>
        )}
        <button
          onClick={toggleChatListCollapse}
          className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-cyber-sidebar rounded-full p-1 text-cyber-blue shadow-lg hover:bg-cyber-blue/20 z-10"
          style={{ right: isChatListCollapsed ? "-12px" : "-12px" }} // Adjust position when collapsed
        >
          {isChatListCollapsed ? (
            <Icon
              solid
              name="px-chevrons-vertical"
              className="size-5 rotate-90"
            />
          ) : (
            <Icon
              solid
              name="px-chevrons-vertical"
              className="size-5 rotate-90"
            />
          )}
        </button>
      </div>

      {/* Resizer Handle 1 */}
      <div
        className="relative w-2 cursor-ew-resize bg-cyber-border/20 hover:bg-cyber-blue/50 transition-colors duration-100"
        onMouseDown={(e) => startResizing(e, "chatList")}
      >
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-cyber-border/50 group-hover:bg-cyber-blue/80" />
      </div>

      {/* Main Chat Window */}
      <div className="flex flex-1 flex-col">
        <DesktopWindow selectedChatId={selectedChatId} />
      </div>

      {/* Resizer Handle 2 */}
      <div
        className="group/handle origin-center relative hover:drop-shadow-[0_2px_6px_rgba(0,245,255,0.75)] hover:w-2 w-0.5 hover:my-4 rounded-full cursor-ew-resize bg-gradient-to-br from-cyber-border/80 to-cyber-border/60 hover:from-cyan-100 hover:via-orange-200/50 hover:via-70% hover:to-teal-200/70 transition-all duration-300 ease-out"
        onMouseDown={(e) => startResizing(e, "chatDetails")}
      >
        <div className="absolute inset-y-0 left-1/2 w-2 opacity-20 -translate-x-1/2 bg-cyber-border/60 group-hover:bg-cyber-blue/30" />
      </div>

      {/* Chat Details Sidebar */}
      <div
        className="relative flex flex-shrink-0 flex-col bg-cyber-panel transition-all duration-200 ease-in-out"
        style={{
          width: isChatDetailsCollapsed ? COLLAPSED_WIDTH : chatDetailsWidth,
        }}
      >
        {!isChatDetailsCollapsed && (
          <ScrollArea className="flex-1 pr-2">
            <ShopColumn onClose={() => {}} />
          </ScrollArea>
        )}
        <button
          onClick={toggleChatDetailsCollapse}
          className="absolute shadow-lg bg-cyber-sidebar left-0 top-[66px] -translate-y-1/2 transform rounded-full flex items-center justify-center size-7 hover:text-cyber-blue text-cyber-blue/60 cursor-pointer hover:bg-cyber-blue/10 z-10 aspect-square"
          style={{ left: isChatDetailsCollapsed ? "-28px" : "-12px" }} // Adjust position when collapsed
        >
          {isChatDetailsCollapsed ? (
            <Icon
              solid
              name="px-chevron-right"
              className="size-5 rotate-180 shrink-0"
            />
          ) : (
            <Icon
              solid
              name="px-chevrons-vertical"
              className="size-5 shrink-0 rotate-90"
            />
          )}
        </button>
      </div>
    </div>
  );
};
