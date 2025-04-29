/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `UserRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRating_userId_movieId_key" ON "UserRating"("userId", "movieId");
