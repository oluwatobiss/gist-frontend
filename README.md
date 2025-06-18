# Gist Website

This is the official website of the Gist Social App. Gist is a subject-based social app that enables users to socialize and engage in discussions about topics they share an interest in.

## Pages

- **Homepage:**
  - Welcome user
  - User login/signup/logout UI
  - Profile page navigation
  - Channels page navigation (where users can subscribe and unsubscribe to channels)
  - Users management navigation (admin-only)
  - Channel creation navigation (admin-only)
- **Chat page:**
  - Channel list
  - Allow users to send and receive messages to and from other users in the chat room
- **Signup:**
  - First name
  - Last name
  - Username (unique)
  - Email (unique)
  - Password
  - Admin confirmation
- **Login:**
  - Email
  - Password
- **Create Channel (admin-only):**
  - Name
  - Image
- **Channel Management:**
  - List all channels
  - UI to subscribe/unsubscribe to channels
  - UI to edit each channel (admin-only)
  - UI to delete each channel (admin-only)
- **Update Channel (admin-only):**
  - Name
  - Image
- **Profile Management:**
  - First name
  - Last name
  - Email (unique)
  - Admin confirmation
- **Users Management (admin-only):**
  - List all users
  - UI to delete each user

## Users and privileges

- **Basic:** Authenticated user
- **Admin:** An administrator

| Privilege                   | Basic | Admin |
| --------------------------- | ----- | ----- |
| Create an account           | Yes   | Yes   |
| Send messages               | Yes   | Yes   |
| Receive messages            | Yes   | Yes   |
| Update personal profile     | Yes   | Yes   |
| Update non-personal profile | No    | No    |
| Delete personal account     | Yes   | No    |
| Delete non-personal account | No    | Yes   |
| Create chat rooms           | No    | Yes   |
| Manage chat rooms           | No    | Yes   |

## Technologies used

- Next.js
- React
- Tailwind CSS
- TypeScript
- SWR
- StreamChat

## Usage

> **Note:** [The backend](https://github.com/oluwatobiss/gist-backend) must be running for this website to function appropriately.

1. Clone the project

```bash
git clone https://github.com/oluwatobiss/gist-frontend.git
```

2. Navigate into the project repo

```bash
cd gist-frontend
```

3. Install dependencies

```bash
npm install
```

4. Create an environment variable file

```bash
touch .env
```

5. Define the project's environment variables

```
PUBLIC_BACKEND_URI="http://localhost:3001"
NEXT_PUBLIC_STREAM_API_KEY=x0xxxxxx0x0x
```

6. Start the server

```bash
npm run dev
```

## Live Demo

- https://gist.netlify.app/

## Related Repos

- [Gist Rest API](https://github.com/oluwatobiss/gist-backend)
