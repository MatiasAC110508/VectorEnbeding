"use client";

import { useEffect, useState } from "react";
import { ClientPayload } from "@/modules/clients/domain/client";
import { SelectField } from "@/modules/shared/components/select-field";
import { TextField } from "@/modules/shared/components/text-field";

interface ClientFormProps {
  initialValues: ClientPayload;
  mode: "create" | "edit";
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: ClientPayload) => Promise<void>;
}

export function ClientForm({
  initialValues,
  mode,
  isSubmitting,
  onCancel,
  onSubmit,
}: ClientFormProps) {
  const [values, setValues] = useState<ClientPayload>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onSubmit(values);
    } catch {
      // The panel already exposes the error message, so the form can stay quiet.
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <TextField
        label="Company"
        name="companyName"
        value={values.companyName}
        placeholder="Northwind Labs"
        onChange={(value) =>
          setValues((current) => ({ ...current, companyName: value }))
        }
      />
      <TextField
        label="Contact"
        name="contactName"
        value={values.contactName}
        placeholder="Ethan Brooks"
        onChange={(value) =>
          setValues((current) => ({ ...current, contactName: value }))
        }
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        placeholder="ethan@northwind.dev"
        onChange={(value) =>
          setValues((current) => ({ ...current, email: value }))
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Industry"
          name="industry"
          value={values.industry}
          options={[
            { label: "Finance", value: "finance" },
            { label: "Healthcare", value: "healthcare" },
            { label: "Retail", value: "retail" },
            { label: "Technology", value: "technology" },
          ]}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              industry: value as ClientPayload["industry"],
            }))
          }
        />
        <SelectField
          label="Status"
          name="status"
          value={values.status}
          options={[
            { label: "Active", value: "active" },
            { label: "Prospect", value: "prospect" },
            { label: "Inactive", value: "inactive" },
          ]}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              status: value as ClientPayload["status"],
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create client"
              : "Update client"}
        </button>
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
