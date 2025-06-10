"use client";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import type {
  User,
  ChannelSort,
  ChannelFilters,
  ChannelOptions,
} from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "../_layout.css";

export default function ChatRoom() {
  const userToken =
    typeof window !== "undefined" && localStorage.getItem("streamToken");
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);
  const userData: User = { id: loggedInUser.username };

  const sort: ChannelSort = { last_message_at: -1 };
  const filters: ChannelFilters = {
    type: "messaging",
    // members: { $in: [loggedInUser.username] },
  };
  const options: ChannelOptions = {
    limit: 10,
  };

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [cachedUserData, setCachedUserData] = useState(userData);

  if (userData.id !== cachedUserData.id) setCachedUserData(userData);

  console.log("=== ChatRoom ===");
  console.log(loggedInUser);
  console.log(chatClient);

  useEffect(() => {
    if (!userToken || !loggedInUser) return;

    const client = new StreamChat(process.env.NEXT_PUBLIC_STREAM_API_KEY!);

    console.log("=== ChatRoom useEffect ===");
    console.log(client);

    if (
      client.tokenManager.token === userToken &&
      client.userID === cachedUserData.id
    )
      return;

    let didUserConnectInterrupt = false;

    const connectionPromise = client
      .connectUser(cachedUserData, userToken)
      .then(() => {
        if (!didUserConnectInterrupt) setChatClient(client);
      })
      .catch((e) => console.error(e));

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(null);
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log(
            `Connection for user "${cachedUserData.id}" has been closed`
          );
        })
        .catch((e) => console.error(e));
    };
  }, [cachedUserData]);

  if (!chatClient) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={chatClient}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
