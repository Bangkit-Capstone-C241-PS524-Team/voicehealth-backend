/*
  Warnings:

  - Added the required column `category` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drugs` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keluhan` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `category` VARCHAR(100) NOT NULL,
    ADD COLUMN `drugs` JSON NOT NULL,
    ADD COLUMN `keluhan` TEXT NOT NULL;
