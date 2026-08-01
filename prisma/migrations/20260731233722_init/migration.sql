-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "matched" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "faqId" INTEGER,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_question_key" ON "FAQ"("question");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE SET NULL ON UPDATE CASCADE;
