Work in progress to the new Myrmecophoto website, continuous deployment at https://myrmecophoto.netlify.app/. Based on Nuxt hosted by Netlify. The original website that I migrate is http://www.myrmecophoto.fr/ (based on PHP CodeIgniter, MySQL, from scratch Sass & jQuery)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b121a494-a2dc-474d-ba33-b37ecebee4ad/deploy-status)](https://app.netlify.com/sites/myrmecophoto/deploys)

## Setup

Require Node v16 and just exec `yarn`

## Development Server

```bash
# Start the development server on http://localhost:3000
yarn dev
```

## Manage Database with Prisma

SQLite Database is managed by Prisma ORM.

**Update content** with Prisma Studio

```bash
yarn prisma studio
```

**Update schema** only by `prisma/schema.prisma`

```bash
# 1. update `prisma/schema.prisma`

# 2.
yarn prisma migrate dev --name my_changes --create-only

# 3. check the `prisma/migrations/{time}_my_changes/migration.sql` file & update if necessary

# 4.
yarn prisma migrate dev
```

**Prisma is broken**, delete all files in `./prisma` except `database.sqlite` & minimal config of `schema.prisma`

```bash
yarn init-db
```

## TODO

- [x] build "list of articles" page
  - [x] engine (route, etc.) => custom Vue
  - [x] get all content
- [ ] build all articles pages
  - [x] engine (route, etc.) => Nuxt Content
  - [x] add "articles" content
  - [ ] add "outdoor pictures" as articles content (from old DB)
- [ ] prepare SQLITE database (imported from existing MySQL)
  - [x] rename table & field
  - [x] delete unused table
  - [x] install & configure Prisma
  - [x] test simple query on JAMStack
  - [ ] add table `picture_taxonomy_material` & alter table `picture_taxonomy`
- [x] better lint JS/TS
- [x] build "list of specimens pictures" page 
  - [x] engine (route, etc.) => custom Vue => use Prisma
  - [x] build all request api
  - [x] get all content
- [x] build all specimens pictures pages
  - [x] engine (route, etc.) => custom Vue => use Prisma
  - [x] build all request api
  - [x] get all content
- [ ] write contact page (hybrid ?)
- [ ] write about page
- [ ] Integrate entire site UI/UX
  - [ ] Install framework CSS (UnoCSS ?)
  - [ ] Install & configure stylelint
  - [ ] Add custom Font
  - [ ] Add favicons
- [ ] error page (404)
- [ ] test between module nuxt webvitals <=> netlify webvitals
- [ ] add robot.txt
- [ ] add sitemap.xml
- [ ] add schema.org ?
- [ ] add GA
- [ ] add 302 from old website
- [ ] migrate domain
- [ ] test Cloudinary or similar image hosting
- [ ] write a complete README
