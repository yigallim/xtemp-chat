import { Avatar, Collapse, ListItem, Paper, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { User } from "../pages/Chat";

type MessageProps = {
  user?: User;
  id: number;
  content: string;
  timestamp: number;
  userId: string;
  pfpSource: string;
  isConsecutive: boolean;
  isExpand: boolean;
  onClick: (id: number) => void;
};

export default function Message({
  user,
  id,
  content,
  timestamp,
  userId,
  pfpSource,
  isConsecutive,
  isExpand,
  onClick,
}: MessageProps) {
  const auth = useAuth();
  const isOwnMessage = auth.id === userId;
  const userName = user ? `${user.firstName} ${user.lastName}` : "Disabled User";

  return (
    <>
      {isConsecutive || (
        <Typography
          sx={{ pt: 0.8, px: 4.8, textAlign: isOwnMessage ? "right" : "left", display: "block" }}
          variant="caption"
        >
          {userName}
        </Typography>
      )}
      <ListItem
        alignItems="flex-start"
        sx={{
          flexDirection: isOwnMessage ? "row-reverse" : "row",
          pt: 0,
          pb: 0.45,
          px: 0,
          gap: 0.8,
        }}
      >
        {isConsecutive ? (
          <div style={{ width: 28, height: 28 }}></div>
        ) : (
          <Avatar sx={{ width: 28, height: 28 }} src={pfpSource} />
        )}
        <div
          style={{
            maxWidth: "65%",
            cursor: "pointer",
          }}
          onClick={() => {
            onClick(id);
          }}
        >
          <Paper
            elevation={0}
            className={"message-item" + (isOwnMessage ? " own-message" : "")}
            sx={{ px: 1.4, py: 1, width: "initial" }}
          >
            <Typography lineHeight={1} variant="body1">
              {content}
            </Typography>
          </Paper>
        </div>
      </ListItem>
      <Collapse
        in={isExpand}
        style={{
          paddingBottom: isExpand ? 6 : 0,
          transition: "0.3s",
          paddingInline: 36,
          textAlign: isOwnMessage ? "right" : "left",
        }}
      >
        <Typography lineHeight={1} variant="caption" color="textSecondary">
          {new Date(timestamp).toLocaleString()}
        </Typography>
      </Collapse>
    </>
  );
}
