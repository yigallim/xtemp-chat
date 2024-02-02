import React, { createContext, useState, ReactNode, useEffect } from "react";
import { RequestMessage } from "../pages/Chat";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../api/instance";

export type ResponseMessage = {
  _id: number;
  userId: string;
  content: string;
  timestamp: number;
};

export interface MessageContextProps {
  messages: ResponseMessage[];
  emitMessage: (message: RequestMessage) => void;
}

export const MessageContext = createContext<MessageContextProps | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ResponseMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`http://${BASE_URL}:3000`);

    newSocket.on("initialMessages", (data: ResponseMessage[]) => {
      setMessages([...data]);
    });

    newSocket.on("message", (data: ResponseMessage[]) => {
      setMessages([...data]);
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const emitMessage = (message: RequestMessage) => {
    if (socket) socket.emit("message", message);
  };

  return (
    <MessageContext.Provider value={{ messages, emitMessage }}>{children}</MessageContext.Provider>
  );
};
