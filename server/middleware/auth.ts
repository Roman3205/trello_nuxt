import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    const protectedRoutes = ["/api/boards", "/api/users", "/api/lists"];

    const isProtected = protectedRoutes.some((route) =>
      getRequestURL(event).pathname.startsWith(route)
    );
    if (!isProtected) {
      return;
    }

    if (!session) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    // @ts-expect-error
    event.context.userId = session?.user?._id;
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: "Issues with authorization",
    });
  }
});
