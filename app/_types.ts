type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;
type Errors = { msg: string; path: string };
type GetUsersOption = { url: string; userToken: string };
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
  Errors,
  FormEvent,
  GetUsersOption,
  PostUserOption,
  PostUserAuthOption,
  User,
};
