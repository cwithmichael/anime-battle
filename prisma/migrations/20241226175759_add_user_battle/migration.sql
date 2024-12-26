-- CreateTable
CREATE TABLE "user_battle" (
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "item_one_id" TEXT NOT NULL,
    "item_two_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_battle_pkey" PRIMARY KEY ("item_one_id","item_two_id","user_id")
);

-- AddForeignKey
ALTER TABLE "user_battle" ADD CONSTRAINT "user_battle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
