import { randomUUID } from "node:crypto";
import { readDatabase, writeDatabase } from "@/server/database/file-database";
import { User, UserPayload } from "@/modules/users/domain/user";

export async function listUsers() {
  const database = await readDatabase();
  return database.users.toSorted(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function findUserById(id: string) {
  const database = await readDatabase();
  return database.users.find((user) => user.id === id) ?? null;
}

export async function insertUser(payload: UserPayload) {
  const database = await readDatabase();
  const newUser: User = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  database.users.unshift(newUser);
  await writeDatabase(database);

  return newUser;
}

export async function updateUserRecord(id: string, payload: UserPayload) {
  const database = await readDatabase();
  const userIndex = database.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser: User = {
    ...database.users[userIndex],
    ...payload,
  };

  database.users[userIndex] = updatedUser;
  await writeDatabase(database);

  return updatedUser;
}

export async function deleteUserRecord(id: string) {
  const database = await readDatabase();
  const nextUsers = database.users.filter((user) => user.id !== id);

  if (nextUsers.length === database.users.length) {
    return false;
  }

  database.users = nextUsers;
  await writeDatabase(database);

  return true;
}
