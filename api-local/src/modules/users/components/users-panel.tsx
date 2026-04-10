"use client";

import { startTransition, useState } from "react";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { SectionCard } from "@/modules/shared/components/section-card";
import { DataTable } from "@/modules/shared/components/data-table";
import { StatusPill } from "@/modules/shared/components/status-pill";
import { formatDate } from "@/modules/shared/utils/format-date";
import { useCrudResource } from "@/modules/shared/hooks/use-crud-resource";
import {
  createUserRequest,
  deleteUserRequest,
  fetchUsers,
  updateUserRequest,
} from "@/modules/users/client/user-api";
import { User, UserPayload } from "@/modules/users/domain/user";
import { UserForm } from "@/modules/users/components/user-form";

const emptyUserPayload: UserPayload = {
  name: "",
  email: "",
  role: "manager",
  status: "active",
};

export function UsersPanel() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { items, isLoading, isSubmitting, error, createItem, updateItem, deleteItem } =
    useCrudResource<User, UserPayload>({
      fetchAll: fetchUsers,
      createOne: createUserRequest,
      updateOne: updateUserRequest,
      deleteOne: deleteUserRequest,
    });

  async function handleSubmit(payload: UserPayload) {
    if (formMode === "create") {
      await createItem(payload);
    } else if (selectedUser) {
      await updateItem(selectedUser.id, payload);
    }

    startTransition(() => {
      setSelectedUser(null);
      setFormMode("create");
    });
  }

  async function handleDelete(id: string) {
    await deleteItem(id);

    if (selectedUser?.id === id) {
      startTransition(() => {
        setSelectedUser(null);
        setFormMode("create");
      });
    }
  }

  const initialValues = selectedUser
    ? {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      }
    : emptyUserPayload;

  return (
    <SectionCard className="grid gap-6 bg-[var(--surface-strong)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Users
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Manage internal platform access
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Create, edit, and remove users through the local API. Every action
            uses a typed client adapter instead of mutating local component state
            directly.
          </p>
        </div>
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          type="button"
          onClick={() => {
            setSelectedUser(null);
            setFormMode("create");
          }}
        >
          New user
        </button>
      </div>

      <div className="grid gap-6">
        <SectionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-none">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {formMode === "create" ? "Create user" : "Edit user"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                User records are validated in the service layer before they reach
                the local database.
              </p>
            </div>
          </div>

          <UserForm
            initialValues={initialValues}
            mode={formMode}
            isSubmitting={isSubmitting}
            onCancel={() => {
              setSelectedUser(null);
              setFormMode("create");
            }}
            onSubmit={handleSubmit}
          />
        </SectionCard>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <DataTable
            items={items}
            getRowId={(user) => user.id}
            emptyState={
              <EmptyState
                title="No users yet"
                description="Create the first user record to populate the local API."
              />
            }
            columns={[
              {
                key: "name",
                title: "User",
                render: (user) => (
                  <div>
                    <p className="font-semibold text-slate-950">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                ),
              },
              {
                key: "role",
                title: "Role",
                render: (user) => (
                  <p className="text-sm font-medium capitalize text-slate-700">
                    {user.role}
                  </p>
                ),
              },
              {
                key: "status",
                title: "Status",
                render: (user) => (
                  <StatusPill
                    label={user.status}
                    tone={user.status === "active" ? "green" : "slate"}
                  />
                ),
              },
              {
                key: "createdAt",
                title: "Created",
                render: (user) => (
                  <p className="font-mono text-xs text-slate-500">
                    {formatDate(user.createdAt)}
                  </p>
                ),
              },
              {
                key: "actions",
                title: "Actions",
                render: (user) => (
                  <div className="flex gap-3">
                    <button
                      className="text-sm font-semibold text-sky-700 transition hover:text-sky-800"
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setFormMode("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                      type="button"
                      onClick={() => {
                        void handleDelete(user.id).catch(() => undefined);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </SectionCard>
  );
}
