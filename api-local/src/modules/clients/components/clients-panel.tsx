"use client";

import { startTransition, useState } from "react";
import { Client, ClientPayload } from "@/modules/clients/domain/client";
import { ClientForm } from "@/modules/clients/components/client-form";
import {
  createClientRequest,
  deleteClientRequest,
  fetchClients,
  updateClientRequest,
} from "@/modules/clients/client/client-api";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatusPill } from "@/modules/shared/components/status-pill";
import { useCrudResource } from "@/modules/shared/hooks/use-crud-resource";
import { formatDate } from "@/modules/shared/utils/format-date";

const emptyClientPayload: ClientPayload = {
  companyName: "",
  contactName: "",
  email: "",
  industry: "technology",
  status: "prospect",
};

export function ClientsPanel() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { items, isLoading, isSubmitting, error, createItem, updateItem, deleteItem } =
    useCrudResource<Client, ClientPayload>({
      fetchAll: fetchClients,
      createOne: createClientRequest,
      updateOne: updateClientRequest,
      deleteOne: deleteClientRequest,
    });

  async function handleSubmit(payload: ClientPayload) {
    if (formMode === "create") {
      await createItem(payload);
    } else if (selectedClient) {
      await updateItem(selectedClient.id, payload);
    }

    startTransition(() => {
      setSelectedClient(null);
      setFormMode("create");
    });
  }

  async function handleDelete(id: string) {
    await deleteItem(id);

    if (selectedClient?.id === id) {
      startTransition(() => {
        setSelectedClient(null);
        setFormMode("create");
      });
    }
  }

  const initialValues = selectedClient
    ? {
        companyName: selectedClient.companyName,
        contactName: selectedClient.contactName,
        email: selectedClient.email,
        industry: selectedClient.industry,
        status: selectedClient.status,
      }
    : emptyClientPayload;

  return (
    <SectionCard className="grid gap-6 bg-[var(--surface-strong)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Clients
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Track external accounts and relationships
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Client operations follow the same modular pipeline, which makes it
            easy to reuse presentation patterns while keeping business rules
            feature-specific.
          </p>
        </div>
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          type="button"
          onClick={() => {
            setSelectedClient(null);
            setFormMode("create");
          }}
        >
          New client
        </button>
      </div>

      <div className="grid gap-6">
        <SectionCard className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-none">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {formMode === "create" ? "Create client" : "Edit client"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                The local API persists every mutation so the dashboard survives
                page refreshes in development.
              </p>
            </div>
          </div>

          <ClientForm
            initialValues={initialValues}
            mode={formMode}
            isSubmitting={isSubmitting}
            onCancel={() => {
              setSelectedClient(null);
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
            Loading clients...
          </div>
        ) : (
          <DataTable
            items={items}
            getRowId={(client) => client.id}
            emptyState={
              <EmptyState
                title="No clients yet"
                description="Create the first client record to populate the local API."
              />
            }
            columns={[
              {
                key: "company",
                title: "Client",
                render: (client) => (
                  <div>
                    <p className="font-semibold text-slate-950">
                      {client.companyName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {client.contactName}
                    </p>
                  </div>
                ),
              },
              {
                key: "industry",
                title: "Industry",
                render: (client) => (
                  <p className="text-sm font-medium capitalize text-slate-700">
                    {client.industry}
                  </p>
                ),
              },
              {
                key: "status",
                title: "Status",
                render: (client) => (
                  <StatusPill
                    label={client.status}
                    tone={
                      client.status === "active"
                        ? "green"
                        : client.status === "prospect"
                          ? "amber"
                          : "slate"
                    }
                  />
                ),
              },
              {
                key: "createdAt",
                title: "Created",
                render: (client) => (
                  <p className="font-mono text-xs text-slate-500">
                    {formatDate(client.createdAt)}
                  </p>
                ),
              },
              {
                key: "actions",
                title: "Actions",
                render: (client) => (
                  <div className="flex gap-3">
                    <button
                      className="text-sm font-semibold text-sky-700 transition hover:text-sky-800"
                      type="button"
                      onClick={() => {
                        setSelectedClient(client);
                        setFormMode("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                      type="button"
                      onClick={() => {
                        void handleDelete(client.id).catch(() => undefined);
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
