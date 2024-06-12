/*
  Warnings:

  - Added the required column `name` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `name` VARCHAR(100) NOT NULL;
