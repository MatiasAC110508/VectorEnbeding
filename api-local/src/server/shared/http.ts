import { NextResponse } from "next/server";
import { HttpError } from "@/server/shared/errors";

export function createSuccessResponse<T>(payload: T, status = 200) {
  return NextResponse.json(payload, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }

  return NextResponse.json(
    { message: "The server could not complete the request." },
    { status: 500 },
  );
}
