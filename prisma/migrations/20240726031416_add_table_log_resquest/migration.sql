-- CreateTable
CREATE TABLE "logRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "body" TEXT,
    "params" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUser" TEXT,
    CONSTRAINT "logRequest_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
