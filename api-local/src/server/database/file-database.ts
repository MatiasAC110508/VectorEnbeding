import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "@/modules/clients/domain/client";
import { User } from "@/modules/users/domain/user";

export interface DatabaseSchema {
  users: User[];
  clients: Client[];
}

const databasePath = path.join(
  process.cwd(),
  "src",
  "server",
  "database",
  "database.json",
);

export async function readDatabase() {
  const fileContent = await readFile(databasePath, "utf8");
  return JSON.parse(fileContent) as DatabaseSchema;
}

export async function writeDatabase(database: DatabaseSchema) {
  // Pretty printing keeps the local database readable during development.
  await writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}
