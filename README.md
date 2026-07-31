# crm_notification_web

Frontend for a small CRM where an admin assigns companies and contacts to users. The assigned user sees a toast and a notification bell badge update instantly, without refreshing, over a Socket.IO connection.

Backend repo: https://github.com/deepanshu921372/crm_notification_api

## Stack

React (Vite), React Router, Tailwind CSS, Axios, socket.io-client, react-hot-toast.

## Setup

```bash
git clone https://github.com/deepanshu921372/crm_notification_web.git
cd crm_notification_web
npm install
cp .env.example .env
npm run dev
```

`.env`:

| Key | What it is |
|---|---|
| `VITE_API_URL` | Backend base URL, for example `http://localhost:5000` |

The backend must be running first. Start it from the api repo with `npm run dev`.

## Status

Being built in stages. Auth, pages and the notification bell are added next.
