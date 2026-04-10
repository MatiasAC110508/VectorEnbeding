import { createUser, getUsers } from "@/modules/users/server/user-service";
import { UserPayload } from "@/modules/users/domain/user";
import { createSuccessResponse, handleRouteError } from "@/server/shared/http";

export async function GET() {
  try {
    const users = await getUsers();
    return createSuccessResponse({
      data: users,
      meta: {
        total: users.length,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as UserPayload;
    const user = await createUser(payload);

    return createSuccessResponse(
      {
        data: user,
        message: "User created successfully.",
      },
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
