Work in progress to the new Myrmecophoto website, continuous deployment at https://myrmecophoto.netlify.app/. Based on Nuxt hosted by Netlify. The original website that I migrate is http://www.myrmecophoto.fr/ (based on PHP CodeIgniter, MySQL, from scratch Sass & jQuery)

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## TODO

- [x] render "articles" page
- [x] disable auto route content and build own vue article tpl
- [ ] import/merge articles outdoor
    - [ ] output content from DB
- [ ] write about page
- [ ] write contact page (hybrid ?)
- [ ] prepare SQLITE database
    - [ ] rename table & field
    - [ ] delete unused table
- [ ] install & configure Prisma
- [ ] render pages/photos-taxo content using DB
- [ ] render pages/photos-taxo/[specie] content using DB
- [ ] better lint JS/TS
- [ ] error page (404)
- [ ] install framework CSS (UnoCSS ?)
- [ ] install & configure stylelint
- [ ] Inegrate entire site
- [ ] Integrate custom Font
- [ ] test between module nuxt webvitals <=> netlify webvitals
- [ ] add favicons
- [ ] add robot.txt
- [ ] add sitemap.xml
- [ ] add GA
- [ ] migrate domain
- [ ] test Cloudinary or similar image hosting
- [ ] write a complete README
