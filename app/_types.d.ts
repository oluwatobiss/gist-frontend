import { DefaultChannelData } from "stream-chat-react";

declare module "stream-chat" {
  interface CustomChannelData extends DefaultChannelData {
    image?: string;
  }
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type DeleteUserOptions = { userId: number; userToken: string | false | null };
type Errors = { msg: string; path: string };
type FormEvent = React.FormEvent<HTMLFormElement>;
type GetUsersOptions = { url: string; userToken: string };
type loggedInUser = { id: number; username: string; status: string };
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
type PostChannelOption = { arg: { name: string; imageUrl: string } };
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
  DeleteUserOptions,
  Errors,
  FormEvent,
  GetUsersOptions,
  loggedInUser,
  PostUserOption,
  PostChannelOption,
  PostUserAuthOption,
  User,
};
