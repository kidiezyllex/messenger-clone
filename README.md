<h1 align="center">
  Booking Hotel Web App
</h1>

### Contents

- [Contents](#contents)
- [Built With](#built-with)
- [Getting Started](#getting-started)

### Built With

- Front-End: NextJs14
  - UI: ShadCN, TailwindCSS
  - Animation: Animata
- Back-End: NextJs14 Api, Prisma, PostgreSQL
- Serverless Postgres DB Platform: Neon Tech
- Real-time messaging : Pusher
- Credential authentication : Next Auth
- Image Uploading: uploadthing

### Getting Started

1. Clone git

```
git init
git clone https://github.com/kidiezyllex/messenger-clone.git
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
<!-- DB -->
DATABASE_URL=

<!-- Upload Image with Uploadthing -->
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

5. Run application

```
npm run dev
```

6. Prisma

```
<!-- Update DB -->
- npx prisma generate
- npx prisma db push

<!-- View DB -->
- npx prisma studio
```
