/*
  Warnings:

  - The primary key for the `battle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemOneId` on the `battle` table. All the data in the column will be lost.
  - You are about to drop the column `itemOneVotes` on the `battle` table. All the data in the column will be lost.
  - You are about to drop the column `itemTwoId` on the `battle` table. All the data in the column will be lost.
  - You are about to drop the column `itemTwoVotes` on the `battle` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `item` table. All the data in the column will be lost.
  - Added the required column `item_one_id` to the `battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_two_id` to the `battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "battle" DROP CONSTRAINT "battle_pkey",
DROP COLUMN "itemOneId",
DROP COLUMN "itemOneVotes",
DROP COLUMN "itemTwoId",
DROP COLUMN "itemTwoVotes",
ADD COLUMN     "item_one_id" TEXT NOT NULL,
ADD COLUMN     "item_one_votes" INTEGER DEFAULT 0,
ADD COLUMN     "item_two_id" TEXT NOT NULL,
ADD COLUMN     "item_two_votes" INTEGER DEFAULT 0,
ADD CONSTRAINT "battle_pkey" PRIMARY KEY ("item_one_id", "item_two_id");

-- AlterTable
ALTER TABLE "item" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "first_name" VARCHAR(255),
ADD COLUMN     "last_name" VARCHAR(255);
