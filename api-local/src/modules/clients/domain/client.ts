export type ClientIndustry =
  | "finance"
  | "healthcare"
  | "retail"
  | "technology";

export type ClientStatus = "active" | "prospect" | "inactive";

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  industry: ClientIndustry;
  status: ClientStatus;
  createdAt: string;
}

export interface ClientPayload {
  companyName: string;
  contactName: string;
  email: string;
  industry: ClientIndustry;
  status: ClientStatus;
}
