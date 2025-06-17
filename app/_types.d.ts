import { DefaultChannelData } from "stream-chat-react";

declare module "stream-chat" {
  interface CustomChannelData extends DefaultChannelData {
    image?: string;
  }
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type Channel = {
  id: number;
  name: string;
  imageUrl: string;
  creatorId: string;
  streamId: string;
  members: User[];
};
type DeleteFetcherOptions = { id: string; userToken: string | false | null };
type Errors = { msg: string; path: string };
type FormEvent = React.FormEvent<HTMLFormElement>;
type GetFetcherOptions = { url: string; userToken: string };
type LoggedInUser = { id: number; username: string; status: string };
type PostUserArg = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  admin: boolean;
  adminCode: string;
};
type PostUserOption = { arg: PostUserArg };
type PutUserOption = {
  arg: Omit<PostUserArg, "username" | "password"> & {
    userToken: string | false | null;
  };
};
type UpsertFetcherOption = { arg: { name: string; imageUrl: string } };
type SubscriptionOption = {
  arg: {
    channelId: string;
    username: string;
    userToken: string | false | null;
  };
};
type PostUserAuthOption = { arg: { email: string; password: string } };
type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  status: string;
};

export type {
  ChangeEvent,
  Channel,
  DeleteFetcherOptions,
  Errors,
  FormEvent,
  GetFetcherOptions,
  LoggedInUser,
  PostUserOption,
  PutUserOption,
  UpsertFetcherOption,
  PostUserAuthOption,
  SubscriptionOption,
  User,
};
