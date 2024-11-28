<h1 align="center">
  Booking Hotel Web App
</h1>

### Contents

- [Contents](#contents)
- [Built With](#built-with)
- [Getting Started](#getting-started)

### Built With

![](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![]()

### Getting Started

1. Clone git

```
git init
git clone https://github.com/kidiezyllex/booking-hotel-webapp.git
```

2. Install packages

```
npm i
```

3. Create ".env" file in root folder

```
DATABASE_URL=
```

4. Create ".env.local" file in root folder

```
<!-- Auth with Clerk -->
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

<!-- DB -->
DATABASE_URL=

<!-- Upload Image with Uploadthing -->
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

<!-- Get Vietnam provinces, districts, wards -->
VN_PUBLIC_API=

<!-- Payment with Stripe -->
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

```

5. Run application

```
npm run dev
```

6. Prisma

```
<!-- Update DB -->
- stop server
- npx prisma generate
- npx prisma db push

<!-- View DB -->
- npx prisma studio
```
