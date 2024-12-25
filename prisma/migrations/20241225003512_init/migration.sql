-- CreateTable
CREATE TABLE "battle" (
    "itemOneId" TEXT NOT NULL,
    "itemTwoId" TEXT NOT NULL,
    "itemOneVotes" INTEGER DEFAULT 0,
    "itemTwoVotes" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_pkey" PRIMARY KEY ("itemOneId","itemTwoId")
);

-- CreateTable
CREATE TABLE "item" (
    "id" INTEGER NOT NULL,
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "origin" VARCHAR(255),
    "image" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
