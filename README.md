<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 0;">
    <h1>Luscsenger <img src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1736248592/learning-webdev-blog/portfolio/3_huctrt.jpg" alt="Luscsenger" height="50"></h1>
</div>

[0. Accounts for Testing](#0-accounts-for-testing)
[1. Features](#1-features)
[2. Tech Stack](#2-tech-stack)
[3. API Document](#3-api-document)
[Database Diagram](#database-diagram)
[Run Project](#run-project)

### 0. Accounts for Testing

- **email**: taikhoan1@gmail.com (taikhoan1 --> taikhoan10)

- **password**: 1234567

### 1. Features

### 2. Tech Stack
| **Technology**    | **Description**                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js**       | Renders web pages and handles routing for the Front-End, while also supporting API Routes for the Back-End.                       |
| **TypeScript**    | A strongly typed programming language that builds on JavaScript.                                                                  |
| **Tailwind**      | A utility-first CSS library that supports dark mode and responsive design.                                                        |
| **NextAuth**      | Provides authentication and authorization, manages login sessions, and supports Google and GitHub login.                          |
| **Shadcn UI**     | A UI components library.                                                                                                          |
| **Prisma**        | An ORM (Object-Relational Mapping) tool for automatically generating and managing database schemas, as well as executing queries. |
| **PostgreSQL**    | A scalable and reliable database system.                                                                                          |
| **AWS Neon Tech** | A serverless PostgreSQL hosting platform.                                                                                         |
| **Pusher**        | Enables real-time messaging and manages user online/offline status.                                                               |
| **Uploadthing**   | Handles file and image uploads and storage.                                                                                       |
| **ZegoCloud**     | Supports 1-on-1 video calls and group video calls.                                                                                |

### 3. API Document

##### conversation:

- `[GET] /api/conversations/user/${userId}`: Lấy tất cả conversation của 1 người dùng
- `[PATCH] /api/conversations/${conversationId}`: Cập nhật tin nhắn được ghim

##### friend-requests:

- `[POST] /api/friend-requests/accept/ [Params:{ friendRequestId, userId }]`: Chấp nhận lời mời kết bạn
- `[POST] /api/friend-requests/reject/ [Params:{ friendRequestId, userId }]`: Từ chối lời mời kết bạn
- `[GET] /api/friend-requests/sent/${userId}`: Danh sách các yêu cầu kết bạn đã gửi
- `[GET] /api/friend-requests/pending/${userId}`: Danh sách lời mời kết bạn

### Database Diagram

### Run Project locally

1. Clone git

```
git init
git clone https://github.com/kidiezyllex/KLTN_FE.git
```

2. Install packages

```
npm i
```

3. Create ".env.local" file in root folder

```
DATABASE_URL=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="NEXTAUTH_SECRET"
GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_ZEGO_APP_ID=
NEXT_PUBLIC_ZEGO_SERVER_SECRET

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID
```

4. Run application

```
npm run dev
```

5. Run Prisma

```
<!-- Install & Initialize -->
npm i prisma
npm i @prisma/client
npx prisma init

<!-- Run this cmd after changing schema.prisma file -->
npx prisma generate

<!-- Push/update database -->
npx prisma db push

<!-- Opens Prisma Studio -->
npx prisma studio
```

6. Check for errors

```
npm run build
npm run lint
```
