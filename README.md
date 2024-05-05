Work in progress to the new **Myrmecophoto** website, continuous deployment at https://myrmecophoto.netlify.app/. Based on Nuxt hosted by Netlify. The original website that I migrate is http://www.myrmecophoto.fr/ (based on PHP CodeIgniter, MySQL, from scratch Sass & jQuery)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b121a494-a2dc-474d-ba33-b37ecebee4ad/deploy-status)](https://app.netlify.com/sites/myrmecophoto/deploys)

## Setup

Require Node v18, copy/paste `.env` from `.env.local` and exec `yarn`

## Development Server

```bash
# Start the development server on http://localhost:3000
yarn dev

# Test SSG and serve at http://localhost:3000
yarn serve-generate
```

## Database

SQLite Database is managed by Prisma ORM. When Nuxt generate static build, it pre-render call api (check `./server/api/` files) by Nitro server (check `./nuxt.config.ts`) and provide a flatten result in JSON. `api/getSpecies` & `api/getTaxa` provide all datas needed to display "Photos Spécimens" section pages. For "SSG" it's useful and website doesn't need to access database on live website. The Database can be more granular with optimized tables, but in my case I prefer to spend time on other things, like UI/UX features. As far as possible, I have followed the conventions proposed by [www.sqlstyle.guide](https://www.sqlstyle.guide/). Below is the Mermaid diagramme ERD of Myrmecophoto Database :

```mermaid
erDiagram

  contributor {
    Int id PK
    String name  "nullable"
    String pseudo  "nullable"
    String url  "nullable"
    }


  country {
    Int id PK
    String name
    }


  form {
    Int id PK
    String name
    }


  genus {
    Int id PK
    String name
    String description  "nullable"
    }


  material {
    Int id PK
    String name
    String description  "nullable"
    }


  researcher {
    Int id PK
    String name
    String wiki_url  "nullable"
    }


  specie {
    Int id PK
    Int year
    String name
    String description  "nullable"
    }


  specimen {
    Int id PK
    String reference  "nullable"
    Float size_mm  "nullable"
    String capture_site  "nullable"
    String capture_date  "nullable"
    String description  "nullable"
    }


  subfamily {
    Int id PK
    String name  "nullable"
    String description  "nullable"
    }


  taxonomy_picture {
    Int id PK
    String date  "nullable"
    String file_name
    String description  "nullable"
    }

    contributor o{--}o specimen : "specimen_specimen_collector_idTocontributor"
    contributor o{--}o specimen : "specimen_specimen_identifier_idTocontributor"
    country o{--}o specimen : "specimen"
    form o{--}o specimen : "specimen"
    genus o{--|| subfamily : "subfamily"
    genus o{--}o specie : "specie"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lens_primary_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_camera_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lighting_system_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_other_material_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lens_secondary_idTomaterial"
    researcher o{--}o specie : "specie"
    specie o{--|| researcher : "researcher"
    specie o{--|| genus : "genus"
    specie o{--}o specimen : "specimen"
    specimen o{--|o country : "country"
    specimen o{--|| form : "form"
    specimen o{--|o contributor : "contributor_specimen_collector_idTocontributor"
    specimen o{--|| specie : "specie"
    specimen o{--|o contributor : "contributor_specimen_identifier_idTocontributor"
    specimen o{--}o taxonomy_picture : "taxonomy_picture"
    subfamily o{--}o genus : "genus"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lens_primary_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_camera_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lighting_system_idTomaterial"
    taxonomy_picture o{--|| specimen : "specimen"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_other_material_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lens_secondary_idTomaterial"
```

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

## Note about email spam protection

I want to share 100% source code, but don't want to be spammed from robots by displaying my email address. To do this in a full SSG & open source code on Github, I've made a strategy to not directly show my email address. The only pre-requisite is the ability of using environnement variable on server (Netlify).

- store the clear address on a `.env`, add the same variable on the server & refer it on `nuxt.config.js`
- `server/api/getEncryptedEmailContact` is prerender by Nitro & use a composable to encrypt email
- at this moment, the encrypted method just reverse all the characters
- in the vue application, it fetch `server/api/getEncryptedEmailContact` & display data with a tricks HTML to reverse direction reading
- the real decrypt happens on event click on email, that redirect to the correct link mailto

I think it can be possible to enhance encryption using CSS technique to display mixed characters...

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
  - [x] Install & configure Stylelint
  - [x] Add reset
  - [x] Add typography
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
- [ ] enhance email encryption
