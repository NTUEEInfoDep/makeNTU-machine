-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaserCutReq" (
    "id" SERIAL NOT NULL,
    "groupname" TEXT NOT NULL,
    "machine" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "material" TEXT[],
    "finalMaterial" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL,
    "timeleft" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaserCutReq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreeDPReq" (
    "id" SERIAL NOT NULL,
    "groupname" TEXT NOT NULL,
    "machine" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "loadBearing" BOOLEAN NOT NULL,
    "material" INTEGER[],
    "comment" TEXT,
    "status" TEXT NOT NULL,
    "timeleft" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreeDPReq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- AddForeignKey
ALTER TABLE "LaserCutReq" ADD CONSTRAINT "LaserCutReq_groupname_fkey" FOREIGN KEY ("groupname") REFERENCES "Account"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreeDPReq" ADD CONSTRAINT "ThreeDPReq_groupname_fkey" FOREIGN KEY ("groupname") REFERENCES "Account"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
