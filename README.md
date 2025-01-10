<p align="center">
  <picture>
  <img src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1736248592/learning-webdev-blog/portfolio/3_huctrt.jpg" height="100" alt="Logo for Luscsenger">
</picture>
</p>
<h3 align="center">Luscsenger: A Real-time Calling & Texting Application</h3>

[0. Accounts](#0-accounts)
[1. Demo](#1-demo)
[2. Tech Stack](#2-tech-stack)
[3. API Document](#3-api-document)
[4. Class Diagram](#4-class-diagram)
[5. Run Project Locally](#5-run-project-locally)

### 0. Accounts

- **email**: taikhoan1@gmail.com (taikhoan1 --> taikhoan12)

- **password**: 1234567

### 1. Demo

### 2. Tech Stack

- **Frontend**: Next.js, NextAuth.js, TypeScript, TailwindCSS, ShadCN/UI, Yet Another React Lightbox, Zustand, Pusher, Zegocloud, Uploadthing.
- **Backend (API Routes)**: Next.js API Routes, TypeScript.
- **ORM/class/Database GUI**: PostgreSQL, Prisma, AWS Neon Tech, Prisma Studio.

### 3. API Document

##### conversation:

- `[GET] /api/conversations/user/${userId}`: Lấy tất cả conversation của 1 người dùng
- `[POST] /api/conversations`: Tạo cuộc hội thoại mới hoặc tạo nhóm
- `[PATCH] /api/conversations/${conversationId}`: Cập nhật tin nhắn được ghim

##### friend-requests:

- `[POST] /api/friend-requests/accept/ [Params:{ friendRequestId, userId }]`: Chấp nhận lời mời kết bạn
- `[POST] /api/friend-requests/reject/ [Params:{ friendRequestId, userId }]`: Từ chối lời mời kết bạn
- `[GET] /api/friend-requests/sent/${userId}`: Danh sách các yêu cầu kết bạn đã gửi
- `[GET] /api/friend-requests/pending/${userId}`: Danh sách lời mời kết bạn

### 4. Class Diagram

![](https://res.cloudinary.com/drqbhj6ft/image/upload/v1736512848/learning-webdev-blog/messenger/messenger-class-diagram_utzmza.png)

### 5. Run Project Locally

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
