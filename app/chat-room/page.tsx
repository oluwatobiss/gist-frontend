"use client";
// import { useState, useEffect } from "react";
import type {
  User,
  ChannelSort,
  ChannelFilters,
  ChannelOptions,
} from "stream-chat";
import {
  useCreateChatClient,
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

const apiKey = "dz5f4d5kzrue";
const userId = "fragrant-meadow-4";
const userName = "fragrant";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZnJhZ3JhbnQtbWVhZG93LTQiLCJleHAiOjE3NDg5OTY5NDV9.YBNF-TmfBF4JdU3egyuW-1HGTMxz2UuLwV6W98yx8Mk";

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: "messaging",
  members: { $in: [userId] },
};
const options: ChannelOptions = {
  limit: 10,
};

export default function ChatRoom() {
  // const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  // useEffect(() => {
  //   if (!client) return;

  //   const channel = client.channel("messaging", "custom_channel_id", {
  //     image: "https://getstream.io/random_png/?name=react",
  //     name: "Talk about React",
  //     members: [userId],
  //   });

  //   setChannel(channel);
  // }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={client}>
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
