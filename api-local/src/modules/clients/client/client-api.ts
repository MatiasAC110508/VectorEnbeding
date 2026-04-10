import { Client, ClientPayload } from "@/modules/clients/domain/client";
import { httpClient } from "@/modules/shared/client/http-client";
import {
  ApiCollectionResponse,
  ApiItemResponse,
  ApiMessageResponse,
} from "@/modules/shared/domain/types/api";

const clientsEndpoint = "/api/clients";

export async function fetchClients() {
  const response =
    await httpClient<ApiCollectionResponse<Client>>(clientsEndpoint);
  return response.data;
}

export async function createClientRequest(payload: ClientPayload) {
  const response = await httpClient<ApiItemResponse<Client>>(clientsEndpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateClientRequest(id: string, payload: ClientPayload) {
  const response = await httpClient<ApiItemResponse<Client>>(
    `${clientsEndpoint}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function deleteClientRequest(id: string) {
  await httpClient<ApiMessageResponse>(`${clientsEndpoint}/${id}`, {
    method: "DELETE",
  });
}
