import { useState, ChangeEvent, KeyboardEvent, useRef } from "react";
import Button from "@mui/material/Button";
import { OutlinedInput } from "@mui/material";

type MessageInputProps = {
  onSendMessage?: (message: string) => void;
};

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage?.(message);
      setMessage("");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        height: 40,
        padding: "8px 10px",
        backgroundColor: "white",
        boxShadow: "0 0 12px 2px rgba(5, 5, 5, 0.1)",
      }}
    >
      <OutlinedInput
        placeholder="Message"
        id="outlined-adornment-weight"
        inputProps={{
          "aria-label": "weight",
        }}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        size="small"
        fullWidth
        value={message}
        inputRef={inputRef}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
}
