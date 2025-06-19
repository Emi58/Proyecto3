/*
  Warnings:

  - The primary key for the `Auditoria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `activoId` on the `Auditoria` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Auditoria` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Mantenimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `activoId` on the `Mantenimiento` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Mantenimiento` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "hallazgo" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL
);
INSERT INTO "new_Auditoria" ("activoId", "fecha", "hallazgo", "id") SELECT "activoId", "fecha", "hallazgo", "id" FROM "Auditoria";
DROP TABLE "Auditoria";
ALTER TABLE "new_Auditoria" RENAME TO "Auditoria";
CREATE TABLE "new_Mantenimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechas" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL
);
INSERT INTO "new_Mantenimiento" ("activoId", "fechas", "id", "observacion", "tipo") SELECT "activoId", "fechas", "id", "observacion", "tipo" FROM "Mantenimiento";
DROP TABLE "Mantenimiento";
ALTER TABLE "new_Mantenimiento" RENAME TO "Mantenimiento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
