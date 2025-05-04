import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { client, useAuth } from "./AuthContext";
import { Socket, Channel, ChannelMessage } from "@heroiclabs/nakama-js";

type ChatMessage = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
};

type ChatContextType = {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  connected: boolean;
  onlineUsers: string[];
};

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: async () => {},
  connected: false,
  onlineUsers: [],
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [, setNextCursor] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { session } = useAuth();

  useEffect(() => {
    if (!session) return;

    const nakamaSocket = client.createSocket(false, false);
    setSocket(nakamaSocket);

    async function connect() {
      // Podaj drugi argument createStatus (np. true)
      await nakamaSocket.connect(session, true);

      // Dołącz do globalnego kanału typu Room o nazwie "global"
      const joinedChannel = await nakamaSocket.joinChat(
        "global",
        1,
        true,
        false
      );

      setChannel(joinedChannel);
      setConnected(true);

      const initialUsers = (joinedChannel.presences ?? [])
        .map((p) => p.user_id)
        .filter((userId) => userId !== session.user_id);

      setOnlineUsers(initialUsers);

      await loadHistory(joinedChannel.id);

      nakamaSocket.onchannelpresence = (presenceEvent) => {
        const joins = presenceEvent.joins ?? [];
        const leaves = presenceEvent.leaves ?? [];

        setOnlineUsers((prevUsers) => {
          const usersAfterLeave = prevUsers.filter(
            (user) => !leaves.some((p) => p.user_id === user)
          );

          const joinedUsers = joins
            .map((p) => p.user_id)
            .filter((userId) => !usersAfterLeave.includes(userId));

          return [...usersAfterLeave, ...joinedUsers];
        });
      };

      nakamaSocket.onchannelmessage = (msg: ChannelMessage) => {
        let content = "";
        if (
          typeof msg.content === "object" &&
          msg.content !== null &&
          "message" in msg.content
        ) {
          if (typeof msg.content === "object" && msg.content !== null) {
            const contentObj = msg.content as { message?: string };
            content = contentObj.message || "";
          }
        } else if (typeof msg.content === "string") {
          content = msg.content;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: msg.message_id,
            username: msg.username || "Anon",
            content,
            timestamp: Number(msg.create_time),
          },
        ]);
      };
    }

    connect();

    return () => {
      if (nakamaSocket && channel) {
        nakamaSocket.leaveChat(channel.id);
        nakamaSocket.disconnect(true);
      }
    };
  }, [session]);

  const sendMessage = async (content: string) => {
    if (!socket || !channel) throw new Error("Not connected to chat");
    await socket.writeChatMessage(channel.id, { message: content });
  };

  const loadHistory = async (
    channelId: string,
    cursor: string | null = null
  ) => {
    if (!session) return;

    try {
      const result = await client.listChannelMessages(
        session,
        channelId,
        20,
        false,
        cursor
      );

      const historyMessages = result.messages.map((msg) => {
        return {
          id: msg.message_id,
          username: msg.username || "X",
          content: msg.content["message"],
          timestamp: Number(msg.create_time),
        } as ChatMessage;
      });

      // Dodaj historię na początek listy, żeby starsze były wyżej
      setMessages((prev) => [...historyMessages.reverse(), ...prev]);

      setNextCursor(result.next_cursor || null);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, connected, onlineUsers }}
    >
      {children}
    </ChatContext.Provider>
  );
};
