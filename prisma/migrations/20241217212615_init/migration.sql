-- CreateTable
CREATE TABLE "Battle" (
    "itemOneId" TEXT NOT NULL,
    "itemTwoId" TEXT NOT NULL,
    "itemOneVotes" INTEGER NOT NULL DEFAULT 0,
    "itemTwoVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL,

    PRIMARY KEY ("itemOneId", "itemTwoId")
);
