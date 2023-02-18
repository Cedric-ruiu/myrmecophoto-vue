Work in progress to the new **Myrmecophoto** website, continuous deployment at https://myrmecophoto.netlify.app/. Based on Nuxt hosted by Netlify. The original website that I migrate is http://www.myrmecophoto.fr/ (based on PHP CodeIgniter, MySQL, from scratch Sass & jQuery)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b121a494-a2dc-474d-ba33-b37ecebee4ad/deploy-status)](https://app.netlify.com/sites/myrmecophoto/deploys)

## Setup

Require Node v16 and exec `yarn`

## Development Server

```bash
# Start the development server on http://localhost:3000
yarn dev
```

## Database

SQLite Database is managed by Prisma ORM. When Nuxt generate static build, it pre-render call api (check `./server/api/` files) by Nitro server (check `./nuxt.config.ts`) and provide a flatten result in JSON. For SSG it's useful and don't need to access database in live website.

![mermaid diagramme ERD of Myrmecophoto Database](./prisma/ERD.md)

**Update content** with Prisma Studio

```bash
yarn prisma studio
```

**Update schema** only by `prisma/schema.prisma`

```bash
# update `prisma/schema.prisma`
yarn prisma migrate dev --name my_changes_name --create-only
# check the `prisma/migrations/{time}_my_changes/migration.sql` file & update if necessary
yarn prisma migrate dev
```

**Prisma is broken**, delete all files in `./prisma` except `database.sqlite` & minimal config of `schema.prisma`

```bash
yarn init-db
```

## TODO for the first release

- [x] build "list of articles" page
  - [x] engine (route, etc.) => custom Vue
  - [x] get all content
- [ ] build all articles pages
  - [x] engine (route, etc.) => Nuxt Content
  - [x] add "articles" content
  - [ ] add "outdoor pictures" as articles content (from old DB)
- [ ] prepare SQLite database (imported from existing MySQL)
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
  - [x] Install framework CSS (UnoCSS ?)
  - [ ] Install & configure Stylelint
  - [ ] Add reset
  - [ ] Add typography
  - [ ] Add layout
  - [ ] Add custom Font
- [ ] error page (404)
- [ ] polish all text
- [ ] test between module `nuxt webvitals` <=> `netlify webvitals`
- [ ] add robot.txt
- [ ] Add favicons
- [ ] add sitemap.xml
- [ ] add schema.org ?
- [ ] add GA
- [ ] add 302 from old website
- [ ] migrate domain
- [ ] test Cloudinary or similar image hosting
- [ ] write a complete README
