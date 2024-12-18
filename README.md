<h1 align="center">
MESSENGER CLONE</h1>
https://www.messenger.com/t

[Teck Stack](#teck-stack)
[Database Diagram](#database-diagram)
[Run Project](#run-project)

### API Document

##### conversation:

- `[GET] /api/conversations/user/${userId}`: Lấy tất cả conversation của 1 người dùng

### Teck Stack

<div style={{display:"inline"}}>
<img src="https://camo.githubusercontent.com/c3635f27439ecdbf20e3cbf969c156f4040f10a0c8c836cf307d916dd8f806d4/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6461726b5f6261636b67726f756e642e706e67" alt="Logo" height="30" >
<img src="https://camo.githubusercontent.com/02d9778d04c0ec14c520fd512e0033ab2413cbd17eee64bdff91da51b832628d/68747470733a2f2f617574686a732e6465762f696d672f6c6f676f2d736d2e706e67" alt="Logo" height="30" >
<img src="https://i.pinimg.com/originals/39/b2/e4/39b2e4ad77c23a2c11e5950a7dfa2aec.png" alt="Logo" height="30" >
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Antu_mongodb.svg/1024px-Antu_mongodb.svg.png" alt="Logo" height="30" >
<img src="https://files.raycast.com/83afy69l6wjib1zd62gya59tpc76" alt="Logo" height="30" >
</div>

### Database Diagram

### Run Project

##### 5.1. Link Web Application:

##### 5.2. Run project locally:

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
