type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;
type Errors = { msg: string; path: string };
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

export type {
  ChangeEvent,
  Errors,
  FormEvent,
  PostUserOption,
  PostUserAuthOption,
};
