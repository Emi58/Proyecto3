-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asignacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaAsignacion" DATETIME NOT NULL,
    "fechaDevolucion" DATETIME,
    "responsable" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "departamentoId" INTEGER,
    "personalId" INTEGER,
    CONSTRAINT "Asignacion_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "Activo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Asignacion" ("activoId", "departamentoId", "fechaAsignacion", "fechaDevolucion", "id", "personalId", "responsable", "usuarioId") SELECT "activoId", "departamentoId", "fechaAsignacion", "fechaDevolucion", "id", "personalId", "responsable", "usuarioId" FROM "Asignacion";
DROP TABLE "Asignacion";
ALTER TABLE "new_Asignacion" RENAME TO "Asignacion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
