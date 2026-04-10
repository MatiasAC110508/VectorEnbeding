import { ClientsPanel } from "@/modules/clients/components/clients-panel";
import { UsersPanel } from "@/modules/users/components/users-panel";
import { SectionCard } from "@/modules/shared/components/section-card";
import { StatCard } from "@/modules/shared/components/stat-card";
import { SearchPanel } from "@/modules/shared/components/search-panel";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <SectionCard className="overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,_rgba(243,181,98,0.28),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(31,41,55,0.94))] text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Local Admin Workspace
              </span>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  File-based local API with modular CRUD flows for users and clients.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  This starter keeps the stack simple while separating domain
                  logic, local data access, typed API clients, reusable UI, and
                  feature modules so the project can grow safely.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard
                title="API Scope"
                value="2 resources"
                description="Users and clients are served through local Next.js route handlers."
              />
              <StatCard
                title="Persistence"
                value="JSON storage"
                description="The local API writes every mutation to a file-based database."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="justify-between bg-white/85">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Architecture Notes
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Clear layers for easier maintenance
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Each feature owns its domain types, server services, client API
              adapter, and presentation layer. Shared hooks and components keep
              the code consistent without coupling feature rules together.
            </p>
          </div>
          <div className="grid gap-3 pt-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Server</p>
              <p className="mt-1 text-sm text-slate-600">
                File database, repositories, validation, and route handlers.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Client</p>
              <p className="mt-1 text-sm text-slate-600">
                Typed fetch helpers, generic CRUD hook, and focused panels.
              </p>
            </div>
          </div>
        </SectionCard>
      </section>
      <SearchPanel />

      <section className="grid gap-6 xl:grid-cols-2">
        <UsersPanel />
        <ClientsPanel />
      </section>
    </main>
  );
}
