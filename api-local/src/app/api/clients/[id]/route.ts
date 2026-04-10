import {
  getClient,
  removeClient,
  updateClient,
} from "@/modules/clients/server/client-service";
import { ClientPayload } from "@/modules/clients/domain/client";
import { createSuccessResponse, handleRouteError } from "@/server/shared/http";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const client = await getClient(id);

    return createSuccessResponse({ data: client });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as ClientPayload;
    const client = await updateClient(id, payload);

    return createSuccessResponse({
      data: client,
      message: "Client updated successfully.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await removeClient(id);

    return createSuccessResponse({
      message: "Client deleted successfully.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
