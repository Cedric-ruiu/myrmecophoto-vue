-- CreateTable
CREATE TABLE "contributor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "pseudo" TEXT,
    "url" TEXT
);

-- CreateTable
CREATE TABLE "country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "genus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subfamily_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "genus_subfamily_id_fkey" FOREIGN KEY ("subfamily_id") REFERENCES "subfamily" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "material_taxonomy_picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "material_id" INTEGER NOT NULL,
    "taxonomy_picture_id" INTEGER NOT NULL,
    CONSTRAINT "material_taxonomy_picture_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "material_taxonomy_picture_taxonomy_picture_id_fkey" FOREIGN KEY ("taxonomy_picture_id") REFERENCES "taxonomy_picture" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "researcher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "wiki_url" TEXT
);

-- CreateTable
CREATE TABLE "specie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genus_id" INTEGER NOT NULL,
    "researcher_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "specie_researcher_id_fkey" FOREIGN KEY ("researcher_id") REFERENCES "researcher" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "specie_genus_id_fkey" FOREIGN KEY ("genus_id") REFERENCES "genus" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "specimen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "specie_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "country_id" INTEGER,
    "collector_id" INTEGER,
    "identifier_id" INTEGER,
    "reference" TEXT,
    "size_mm" REAL,
    "capture_site" TEXT,
    "capture_date" TEXT,
    "description" TEXT,
    CONSTRAINT "specimen_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "specimen_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "form" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "specimen_collector_id_fkey" FOREIGN KEY ("collector_id") REFERENCES "contributor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "specimen_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "specie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "specimen_identifier_id_fkey" FOREIGN KEY ("identifier_id") REFERENCES "contributor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "subfamily" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "taxonomy_picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "specimen_id" INTEGER NOT NULL,
    "camera_id" INTEGER,
    "lens_primary_id" INTEGER,
    "lens_secondary_id" INTEGER,
    "lighting_system_id" INTEGER,
    "other_material_id" INTEGER,
    "date" TEXT,
    "file_name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "taxonomy_picture_lens_primary_id_fkey" FOREIGN KEY ("lens_primary_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "taxonomy_picture_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "taxonomy_picture_lighting_system_id_fkey" FOREIGN KEY ("lighting_system_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "taxonomy_picture_specimen_id_fkey" FOREIGN KEY ("specimen_id") REFERENCES "specimen" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "taxonomy_picture_other_material_id_fkey" FOREIGN KEY ("other_material_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "taxonomy_picture_lens_secondary_id_fkey" FOREIGN KEY ("lens_secondary_id") REFERENCES "material" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_contributor_1" ON "contributor"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_country_1" ON "country"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_form_1" ON "form"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_genus_1" ON "genus"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_material_1" ON "material"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_material_taxonomy_picture_1" ON "material_taxonomy_picture"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_researcher_1" ON "researcher"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_specie_1" ON "specie"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_specimen_1" ON "specimen"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_subfamily_1" ON "subfamily"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_taxonomy_picture_1" ON "taxonomy_picture"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_taxonomy_picture_2" ON "taxonomy_picture"("file_name");
Pragma writable_schema=0;

