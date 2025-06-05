"use client";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import type {
  User,
  ChannelSort,
  ChannelFilters,
  ChannelOptions,
  // OwnUserResponse,
  // StreamChatOptions,
  // TokenOrProvider,
  // UserResponse,
} from "stream-chat";
import {
  // useCreateChatClient,
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

// const apiKey = "dz5f4d5kzrue";
// const userId = "fragrant-meadow-4";
// const userName = "fragrant";
// const userToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZnJhZ3JhbnQtbWVhZG93LTQiLCJleHAiOjE3NDg5OTY5NDV9.YBNF-TmfBF4JdU3egyuW-1HGTMxz2UuLwV6W98yx8Mk";

// const user: User = {
//   id: userId,
//   name: userName,
//   image: `https://getstream.io/random_png/?name=${userName}`,
// };

// const sort: ChannelSort = { last_message_at: -1 };
// const filters: ChannelFilters = {
//   type: "messaging",
//   members: { $in: [userId] },
// };
// const options: ChannelOptions = {
//   limit: 10,
// };

/**
 * React hook to create, connect and return `StreamChat` client.
 */
// export const useCreateChatClient = ({
//   apiKey,
//   options,
//   tokenOrProvider,
//   userData,
// }: {
//   apiKey: string;
//   tokenOrProvider: TokenOrProvider;
//   userData: OwnUserResponse | UserResponse;
//   options?: StreamChatOptions;
// }) => {
//   const [chatClient, setChatClient] = useState<StreamChat | null>(null);
//   const [cachedUserData, setCachedUserData] = useState(userData);

//   if (userData.id !== cachedUserData.id) {
//     setCachedUserData(userData);
//   }

//   const [cachedOptions] = useState(options);

//   useEffect(() => {
//     const client = new StreamChat(apiKey, undefined, cachedOptions);
//     let didUserConnectInterrupt = false;

//     const connectionPromise = client
//       .connectUser(cachedUserData, tokenOrProvider)
//       .then(() => {
//         if (!didUserConnectInterrupt) setChatClient(client);
//       });

//     return () => {
//       didUserConnectInterrupt = true;
//       setChatClient(null);
//       connectionPromise
//         .then(() => client.disconnectUser())
//         .then(() => {
//           console.log(
//             `Connection for user "${cachedUserData.id}" has been closed`
//           );
//         });
//     };
//   }, [apiKey, cachedUserData, cachedOptions, tokenOrProvider]);

//   return chatClient;
// };

export default function ChatRoom() {
  // const [channel, setChannel] = useState<StreamChannel>();
  const userToken = localStorage.getItem("streamToken");
  const loggedInUserJson =
    typeof window !== "undefined" && localStorage.getItem("gistUserData");
  const loggedInUser = loggedInUserJson && JSON.parse(loggedInUserJson);
  const userData: User = { id: loggedInUser.username };

  const sort: ChannelSort = { last_message_at: -1 };
  const filters: ChannelFilters = {
    type: "messaging",
    members: { $in: [loggedInUser.username] },
  };
  const options: ChannelOptions = {
    limit: 10,
  };

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [cachedUserData, setCachedUserData] = useState(userData);

  if (userData.id !== cachedUserData.id) setCachedUserData(userData);

  // const client = useCreateChatClient({
  //   apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  //   tokenOrProvider: userToken,
  //   userData,
  // });

  console.log("=== ChatRoom ===");
  console.log(loggedInUser);
  console.log(chatClient);

  // useEffect(() => {
  //   if (!client) return;

  //   const channel = client.channel("messaging", "custom_channel_id", {
  //     image: "https://getstream.io/random_png/?name=react",
  //     name: "Talk about React",
  //     members: [userId],
  //   });

  //   setChannel(channel);
  // }, [client]);

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
