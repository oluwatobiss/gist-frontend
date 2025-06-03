"use client";
import { Chat, useCreateChatClient } from "stream-chat-react";

// your Stream app information
const apiKey = "dz5f4d5kzrue";
const userId = "yellow-mouse-8";
const userName = "yellow";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieWVsbG93LW1vdXNlLTgiLCJleHAiOjE3NDg5Nzg1ODl9.PSCR87KiCqXTOgiMcBgh3Pp2_48fZI4cLDsMinDDwBc";

export default function ChatRoom() {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: { id: userId, name: userName },
  });

  if (!client) return <div>Setting up client & connection...</div>;

  console.log("=== ChatRoom ===");
  console.log(client);

  return <Chat client={client}>Chat with client is ready!</Chat>;
}
