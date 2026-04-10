import {
  ClientIndustry,
  ClientPayload,
  ClientStatus,
} from "@/modules/clients/domain/client";
import {
  deleteClientRecord,
  findClientById,
  insertClient,
  listClients,
  updateClientRecord,
} from "@/modules/clients/server/client-repository";
import { HttpError } from "@/server/shared/errors";

const clientIndustries: ClientIndustry[] = [
  "finance",
  "healthcare",
  "retail",
  "technology",
];

const clientStatuses: ClientStatus[] = ["active", "prospect", "inactive"];

function validateClientPayload(payload: ClientPayload) {
  if (!payload.companyName.trim()) {
    throw new HttpError(400, "Client company name is required.");
  }

  if (!payload.contactName.trim()) {
    throw new HttpError(400, "Client contact name is required.");
  }

  if (!payload.email.trim()) {
    throw new HttpError(400, "Client email is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new HttpError(400, "Client email must be valid.");
  }

  if (!clientIndustries.includes(payload.industry)) {
    throw new HttpError(400, "Client industry is not supported.");
  }

  if (!clientStatuses.includes(payload.status)) {
    throw new HttpError(400, "Client status is not supported.");
  }
}

export async function getClients() {
  return listClients();
}

export async function getClient(id: string) {
  const client = await findClientById(id);

  if (!client) {
    throw new HttpError(404, "Client not found.");
  }

  return client;
}

export async function createClient(payload: ClientPayload) {
  validateClientPayload(payload);
  return insertClient({
    ...payload,
    companyName: payload.companyName.trim(),
    contactName: payload.contactName.trim(),
    email: payload.email.trim().toLowerCase(),
  });
}

export async function updateClient(id: string, payload: ClientPayload) {
  validateClientPayload(payload);

  const updatedClient = await updateClientRecord(id, {
    ...payload,
    companyName: payload.companyName.trim(),
    contactName: payload.contactName.trim(),
    email: payload.email.trim().toLowerCase(),
  });

  if (!updatedClient) {
    throw new HttpError(404, "Client not found.");
  }

  return updatedClient;
}

export async function removeClient(id: string) {
  const deleted = await deleteClientRecord(id);

  if (!deleted) {
    throw new HttpError(404, "Client not found.");
  }
}
