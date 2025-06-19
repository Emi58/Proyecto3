-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "hallazgo" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL,
    CONSTRAINT "Auditoria_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "Activo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Auditoria" ("activoId", "fecha", "hallazgo", "id") SELECT "activoId", "fecha", "hallazgo", "id" FROM "Auditoria";
DROP TABLE "Auditoria";
ALTER TABLE "new_Auditoria" RENAME TO "Auditoria";
CREATE TABLE "new_Mantenimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechas" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL,
    CONSTRAINT "Mantenimiento_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "Activo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mantenimiento" ("activoId", "fechas", "id", "observacion", "tipo") SELECT "activoId", "fechas", "id", "observacion", "tipo" FROM "Mantenimiento";
DROP TABLE "Mantenimiento";
ALTER TABLE "new_Mantenimiento" RENAME TO "Mantenimiento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
