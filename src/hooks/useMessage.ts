import { useContext } from "react";
import { MessageContext, MessageContextProps } from "../context/MessageProvider";

export const useMessage = (): MessageContextProps => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
