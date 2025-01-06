-- CreateTable
CREATE TABLE "userPass" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "userDetail" (
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "userPass_email_key" ON "userPass"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userDetail_email_key" ON "userDetail"("email");

-- AddForeignKey
ALTER TABLE "userPass" ADD CONSTRAINT "userPass_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userDetail" ADD CONSTRAINT "userDetail_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
