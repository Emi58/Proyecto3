/*
  Warnings:

  - The primary key for the `Activo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Asignacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Auditoria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Departamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Mantenimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Personal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "fechaAdquisicion" DATETIME NOT NULL
);
INSERT INTO "new_Activo" ("estado", "fechaAdquisicion", "id", "marca", "modelo", "numeroSerie", "tipo", "ubicacion") SELECT "estado", "fechaAdquisicion", "id", "marca", "modelo", "numeroSerie", "tipo", "ubicacion" FROM "Activo";
DROP TABLE "Activo";
ALTER TABLE "new_Activo" RENAME TO "Activo";
CREATE TABLE "new_Asignacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fechaAsignacion" DATETIME NOT NULL,
    "fechaDevolucion" DATETIME,
    "responsable" TEXT NOT NULL,
    "activoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    CONSTRAINT "Asignacion_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "Activo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asignacion" ("activoId", "departamentoId", "fechaAsignacion", "fechaDevolucion", "id", "personalId", "responsable", "usuarioId") SELECT "activoId", "departamentoId", "fechaAsignacion", "fechaDevolucion", "id", "personalId", "responsable", "usuarioId" FROM "Asignacion";
DROP TABLE "Asignacion";
ALTER TABLE "new_Asignacion" RENAME TO "Asignacion";
CREATE TABLE "new_Auditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "hallazgo" TEXT NOT NULL,
    "activoId" TEXT NOT NULL
);
INSERT INTO "new_Auditoria" ("activoId", "fecha", "hallazgo", "id") SELECT "activoId", "fecha", "hallazgo", "id" FROM "Auditoria";
DROP TABLE "Auditoria";
ALTER TABLE "new_Auditoria" RENAME TO "Auditoria";
CREATE TABLE "new_Departamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL
);
INSERT INTO "new_Departamento" ("id", "nombre") SELECT "id", "nombre" FROM "Departamento";
DROP TABLE "Departamento";
ALTER TABLE "new_Departamento" RENAME TO "Departamento";
CREATE TABLE "new_Mantenimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fechas" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "activoId" TEXT NOT NULL
);
INSERT INTO "new_Mantenimiento" ("activoId", "fechas", "id", "observacion", "tipo") SELECT "activoId", "fechas", "id", "observacion", "tipo" FROM "Mantenimiento";
DROP TABLE "Mantenimiento";
ALTER TABLE "new_Mantenimiento" RENAME TO "Mantenimiento";
CREATE TABLE "new_Personal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    CONSTRAINT "Personal_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("apellidoMaterno", "apellidoPaterno", "departamentoId", "id", "nombre", "rut") SELECT "apellidoMaterno", "apellidoPaterno", "departamentoId", "id", "nombre", "rut" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_rut_key" ON "Personal"("rut");
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT
);
INSERT INTO "new_Usuario" ("descripcion", "id", "isAdmin", "nombre", "password", "token", "username") SELECT "descripcion", "id", "isAdmin", "nombre", "password", "token", "username" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
