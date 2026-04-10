import { User, UserPayload } from "@/modules/users/domain/user";
import { httpClient } from "@/modules/shared/client/http-client";
import {
  ApiCollectionResponse,
  ApiItemResponse,
  ApiMessageResponse,
} from "@/modules/shared/domain/types/api";

const usersEndpoint = "/api/users";

export async function fetchUsers() {
  const response = await httpClient<ApiCollectionResponse<User>>(usersEndpoint);
  return response.data;
}

export async function createUserRequest(payload: UserPayload) {
  const response = await httpClient<ApiItemResponse<User>>(usersEndpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateUserRequest(id: string, payload: UserPayload) {
  const response = await httpClient<ApiItemResponse<User>>(
    `${usersEndpoint}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function deleteUserRequest(id: string) {
  await httpClient<ApiMessageResponse>(`${usersEndpoint}/${id}`, {
    method: "DELETE",
  });
}
