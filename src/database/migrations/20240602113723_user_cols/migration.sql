/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[no_telp]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_telp` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `email` VARCHAR(100) NOT NULL,
    ADD COLUMN `is_verified` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `no_telp` VARCHAR(15) NOT NULL,
    ADD COLUMN `password` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `User_no_telp_key` ON `User`(`no_telp`);
