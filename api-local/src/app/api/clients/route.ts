import {
  createClient,
  getClients,
} from "@/modules/clients/server/client-service";
import { ClientPayload } from "@/modules/clients/domain/client";
import { createSuccessResponse, handleRouteError } from "@/server/shared/http";

export async function GET() {
  try {
    const clients = await getClients();
    return createSuccessResponse({
      data: clients,
      meta: {
        total: clients.length,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ClientPayload;
    const client = await createClient(payload);

    return createSuccessResponse(
      {
        data: client,
        message: "Client created successfully.",
      },
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
