-- Enable trigram similarity search for efficient fuzzy matching on FAQ.question
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "FAQ_question_trgm_idx" ON "FAQ" USING GIN ("question" gin_trgm_ops);
