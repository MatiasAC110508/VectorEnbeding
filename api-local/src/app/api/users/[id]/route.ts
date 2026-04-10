import { getUser, removeUser, updateUser } from "@/modules/users/server/user-service";
import { UserPayload } from "@/modules/users/domain/user";
import { createSuccessResponse, handleRouteError } from "@/server/shared/http";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getUser(id);

    return createSuccessResponse({ data: user });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as UserPayload;
    const user = await updateUser(id, payload);

    return createSuccessResponse({
      data: user,
      message: "User updated successfully.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await removeUser(id);

    return createSuccessResponse({
      message: "User deleted successfully.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
