import TopBar from "../layout/TopBar";
import Container from "@mui/material/Container";
import { List } from "@mui/material";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useEffect, useRef, useState } from "react";
import { useMessage } from "../hooks/useMessage";
import useAuth from "../hooks/useAuth";
import { getAllProfileRequest } from "../api/profileRequest";
import { Gender } from "./Profile";

export type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: Gender;
};

export type RequestMessage = {
  userId: string;
  content: string;
};

export default function Chat() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { messages, emitMessage } = useMessage();
  const { id } = useAuth();
  const messageListRef = useRef<HTMLUListElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadedUsers, setLoadedUsers] = useState(false);

  const scrollMessageListToBottom = () => {
    if (messageListRef.current) {
      const messageList = messageListRef.current;
      messageList.scrollTop = messageList.scrollHeight;
    }
  };

  useEffect(() => {
    async function asyncGetAllProfileRequest() {
      const usersRequested = await getAllProfileRequest();
      setUsers(usersRequested);
      setLoadedUsers(true);
    }
    asyncGetAllProfileRequest();
  }, []);

  useEffect(() => {
    scrollMessageListToBottom();
  }, [messages]);

  const handleMessageClick = (id: number) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  const handleSendMessage = (message: string) => {
    emitMessage({
      userId: id!,
      content: message,
    });
  };

  return (
    <>
      <TopBar />
      <Container className="inner-container chat" sx={{ px: "0px !important" }}>
        <List
          ref={messageListRef}
          sx={{
            p: "8px",
            overflowY: "auto",
            height: "calc(100% - 16px)",
          }}
        >
          {loadedUsers ? (
            messages.map((message, index) => {
              const lastUsername = messages[index - 1]?.userId;
              const isConsecutiveMessage = lastUsername === message.userId;
              const user = users.find((user) => user._id === message.userId);

              return (
                <Message
                  user={user}
                  id={message._id}
                  key={message._id}
                  content={message.content}
                  timestamp={message.timestamp}
                  userId={message.userId}
                  pfpSource="/pfp.gif"
                  isConsecutive={isConsecutiveMessage}
                  isExpand={expandedId === message._id}
                  onClick={handleMessageClick}
                />
              );
            })
          ) : (
            <></>
          )}
        </List>
      </Container>
      <MessageInput onSendMessage={handleSendMessage} />
    </>
  );
}
