/*
  Warnings:

  - A unique constraint covering the columns `[numeroSerie]` on the table `Activo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activo_numeroSerie_key" ON "Activo"("numeroSerie");
