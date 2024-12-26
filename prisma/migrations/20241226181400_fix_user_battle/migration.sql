/*
  Warnings:

  - The primary key for the `user_battle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user_battle` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `user_battle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_battle" DROP CONSTRAINT "user_battle_user_id_fkey";

-- AlterTable
ALTER TABLE "user_battle" DROP CONSTRAINT "user_battle_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_email" TEXT NOT NULL,
ADD CONSTRAINT "user_battle_pkey" PRIMARY KEY ("item_one_id", "item_two_id", "user_email");

-- AddForeignKey
ALTER TABLE "user_battle" ADD CONSTRAINT "user_battle_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
