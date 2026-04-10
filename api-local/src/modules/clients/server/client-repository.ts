import { randomUUID } from "node:crypto";
import { Client, ClientPayload } from "@/modules/clients/domain/client";
import { readDatabase, writeDatabase } from "@/server/database/file-database";

export async function listClients() {
  const database = await readDatabase();
  return database.clients.toSorted(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function findClientById(id: string) {
  const database = await readDatabase();
  return database.clients.find((client) => client.id === id) ?? null;
}

export async function insertClient(payload: ClientPayload) {
  const database = await readDatabase();
  const newClient: Client = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  database.clients.unshift(newClient);
  await writeDatabase(database);

  return newClient;
}

export async function updateClientRecord(id: string, payload: ClientPayload) {
  const database = await readDatabase();
  const clientIndex = database.clients.findIndex((client) => client.id === id);

  if (clientIndex === -1) {
    return null;
  }

  const updatedClient: Client = {
    ...database.clients[clientIndex],
    ...payload,
  };

  database.clients[clientIndex] = updatedClient;
  await writeDatabase(database);

  return updatedClient;
}

export async function deleteClientRecord(id: string) {
  const database = await readDatabase();
  const nextClients = database.clients.filter((client) => client.id !== id);

  if (nextClients.length === database.clients.length) {
    return false;
  }

  database.clients = nextClients;
  await writeDatabase(database);

  return true;
}
