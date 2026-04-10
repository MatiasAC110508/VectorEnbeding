import { UserPayload, UserRole, UserStatus } from "@/modules/users/domain/user";
import {
  deleteUserRecord,
  findUserById,
  insertUser,
  listUsers,
  updateUserRecord,
} from "@/modules/users/server/user-repository";
import { HttpError } from "@/server/shared/errors";

const userRoles: UserRole[] = ["admin", "manager", "support"];
const userStatuses: UserStatus[] = ["active", "inactive"];

function validateUserPayload(payload: UserPayload) {
  if (!payload.name.trim()) {
    throw new HttpError(400, "User name is required.");
  }

  if (!payload.email.trim()) {
    throw new HttpError(400, "User email is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new HttpError(400, "User email must be valid.");
  }

  if (!userRoles.includes(payload.role)) {
    throw new HttpError(400, "User role is not supported.");
  }

  if (!userStatuses.includes(payload.status)) {
    throw new HttpError(400, "User status is not supported.");
  }
}

export async function getUsers() {
  return listUsers();
}

export async function getUser(id: string) {
  const user = await findUserById(id);

  if (!user) {
    throw new HttpError(404, "User not found.");
  }

  return user;
}

export async function createUser(payload: UserPayload) {
  validateUserPayload(payload);
  return insertUser({
    ...payload,
    email: payload.email.trim().toLowerCase(),
    name: payload.name.trim(),
  });
}

export async function updateUser(id: string, payload: UserPayload) {
  validateUserPayload(payload);

  const updatedUser = await updateUserRecord(id, {
    ...payload,
    email: payload.email.trim().toLowerCase(),
    name: payload.name.trim(),
  });

  if (!updatedUser) {
    throw new HttpError(404, "User not found.");
  }

  return updatedUser;
}

export async function removeUser(id: string) {
  const deleted = await deleteUserRecord(id);

  if (!deleted) {
    throw new HttpError(404, "User not found.");
  }
}
