<p align="center">
  <picture>
  <img src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1736248592/learning-webdev-blog/portfolio/3_huctrt.jpg" height="100" alt="Logo for Luscsenger">
</picture>
</p>
<h3 align="center">Luscsenger: A Real-time Calling & Texting Application</h3>

[0. Accounts](#0-accounts)
[1. Demo](#1-demo)
[2. Tech Stack](#2-tech-stack)
[3. Class Diagram](#3-class-diagram)
[4. Run Project Locally](#4-run-project-locally)

### 0. Accounts

- **email**: taikhoan1@gmail.com (taikhoan1 --> taikhoan12)

- **password**: 1234567

### 1. Demo

### 2. Tech Stack

- **Frontend**: Next.js, NextAuth.js, TypeScript, TailwindCSS, ShadCN/UI, Yet Another React Lightbox, Zustand, Pusher, Zegocloud, Uploadthing.
- **Backend (API Routes)**: Next.js API Routes, TypeScript.
- **ORM/class/Database GUI**: PostgreSQL, Prisma, AWS Neon Tech, Prisma Studio.

### 3. Class Diagram

![](https://res.cloudinary.com/drqbhj6ft/image/upload/v1736512848/learning-webdev-blog/messenger/messenger-class-diagram_utzmza.png)

`User:`

- User - Conversation (Many-to-many): Một người dùng có thể tham gia nhiều cuộc hội thoại, và một cuộc hội thoại có thể có nhiều người dùng.
- User - Message (seenMessages) (Many-to-many): Một người dùng có thể xem nhiều tin nhắn, và một tin nhắn có thể được xem bởi nhiều người dùng.
- User - Message (sentMessages) (One-to-many): Một người dùng có thể gửi nhiều tin nhắn, nhưng mỗi tin nhắn chỉ có một người gửi.
- User - Conversation (groups) (One-to-many): Một người dùng có thể tạo nhiều nhóm hội thoại, nhưng mỗi nhóm chỉ có một người tạo.
- User - Friend (One-to-many): Một người dùng có thể có nhiều bạn bè, nhưng mỗi quan hệ bạn bè chỉ liên kết với một người dùng.
- User - FriendRequest (sentFriendRequests) (One-to-many): Một người dùng có thể gửi nhiều lời mời kết bạn, nhưng mỗi lời mời chỉ có một người gửi.
- User - FriendRequest (receivedFriendRequests) (One-to-many): Một người dùng có thể nhận nhiều lời mời kết bạn, nhưng mỗi lời mời chỉ có một người nhận.

`Conversation:`

- Conversation - User (groupCreator) (Many-to-One): Nhiều cuộc hội thoại có thể có cùng một người tạo nhóm, nhưng mỗi cuộc hội thoại chỉ có một người tạo.
- Conversation - User (users) (Many-to-many): Một cuộc hội thoại có thể có nhiều người dùng, và một người dùng có thể tham gia nhiều cuộc hội thoại.
- Conversation - Message (pinnedMessages) (One-to-many): Một cuộc hội thoại có thể có nhiều tin nhắn được ghim, nhưng mỗi tin nhắn được ghim chỉ thuộc về một cuộc hội thoại.
- Conversation - Message (messages) (One-to-many): Một cuộc hội thoại có thể có nhiều tin nhắn, nhưng mỗi tin nhắn chỉ thuộc về một cuộc hội thoại.

`Message:`

- Message - User (seen) (Many-to-many): Một tin nhắn có thể được xem bởi nhiều người dùng, và một người dùng có thể xem nhiều tin nhắn.
- Message - Conversation (Many-to-One): Nhiều tin nhắn có thể thuộc về một cuộc hội thoại, nhưng mỗi tin nhắn chỉ nằm trong một cuộc hội thoại.
- Message - Conversation (pinnedIn) (Many-to-One): Nhiều tin nhắn có thể được ghim trong một cuộc hội thoại, nhưng mỗi tin nhắn được ghim chỉ nằm trong một cuộc hội thoại.
- Message - User (sender) (Many-to-One): Nhiều tin nhắn có thể được gửi bởi một người dùng, nhưng mỗi tin nhắn chỉ có một người gửi.
- Message - Message (replyTo) (Many-to-One): Nhiều tin nhắn có thể là trả lời cho một tin nhắn, nhưng mỗi tin nhắn trả lời chỉ liên kết với một tin nhắn gốc.
- Message - Message (replies) (One-to-many): Một tin nhắn có thể có nhiều tin nhắn trả lời, nhưng mỗi tin nhắn trả lời chỉ liên kết với một tin nhắn gốc.

`Friend:`

- Friend - User (Many-to-One): Nhiều mối quan hệ bạn bè có thể liên kết với một người dùng, nhưng mỗi mối quan hệ bạn bè chỉ giữa hai người dùng cụ thể.

`FriendRequest:`

- FriendRequest - User (sender) (Many-to-One): Nhiều lời mời kết bạn có thể được gửi bởi một người dùng, nhưng mỗi lời mời chỉ có một người gửi.
- FriendRequest - User (receiver) (Many-to-One): Nhiều lời mời kết bạn có thể được nhận bởi một người dùng, nhưng mỗi lời mời chỉ có một người nhận.

### 4. Run Project Locally

1. Clone git

```
git init
git clone https://github.com/kidiezyllex/messenger-clone.git
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
