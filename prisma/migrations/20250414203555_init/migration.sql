/*
  Warnings:

  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "rating",
DROP COLUMN "review",
ADD COLUMN     "imdbId" TEXT NOT NULL,
ADD COLUMN     "imdbRating" DOUBLE PRECISION,
ADD COLUMN     "imdbVotes" TEXT,
ADD COLUMN     "plot" TEXT,
ADD COLUMN     "poster" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "year" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "subject" TEXT,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRating" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "review" TEXT,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRating_userId_movieId_key" ON "UserRating"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_movieId_key" ON "Favorite"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
