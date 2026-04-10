"use client";

import { useEffect, useState } from "react";
import { SelectField } from "@/modules/shared/components/select-field";
import { TextField } from "@/modules/shared/components/text-field";
import { UserPayload } from "@/modules/users/domain/user";

interface UserFormProps {
  initialValues: UserPayload;
  mode: "create" | "edit";
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: UserPayload) => Promise<void>;
}

export function UserForm({
  initialValues,
  mode,
  isSubmitting,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserPayload>(initialValues);

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
        label="Name"
        name="name"
        value={values.name}
        placeholder="Olivia Carter"
        onChange={(value) => setValues((current) => ({ ...current, name: value }))}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        placeholder="olivia@localcrm.dev"
        onChange={(value) =>
          setValues((current) => ({ ...current, email: value }))
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Role"
          name="role"
          value={values.role}
          options={[
            { label: "Admin", value: "admin" },
            { label: "Manager", value: "manager" },
            { label: "Support", value: "support" },
          ]}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              role: value as UserPayload["role"],
            }))
          }
        />
        <SelectField
          label="Status"
          name="status"
          value={values.status}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              status: value as UserPayload["status"],
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
              ? "Create user"
              : "Update user"}
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
