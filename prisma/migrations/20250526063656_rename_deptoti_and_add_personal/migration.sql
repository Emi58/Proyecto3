-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT
);

-- CreateTable
CREATE TABLE "Activo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "fechaAdquisicion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaAsignacion" DATETIME NOT NULL,
    "fechaDevolucion" DATETIME,
    "responsable" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "personalId" INTEGER NOT NULL,
    CONSTRAINT "Asignacion_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "Activo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asignacion_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    CONSTRAINT "Personal_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mantenimiento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechas" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "hallazgo" TEXT NOT NULL,
    "activoId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_rut_key" ON "Personal"("rut");
