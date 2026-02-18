/*
  Warnings:

  - A unique constraint covering the columns `[codigoDaUnidadeConsumidora]` on the table `Unidade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Unidade_codigoDaUnidadeConsumidora_key` ON `Unidade`(`codigoDaUnidadeConsumidora`);
