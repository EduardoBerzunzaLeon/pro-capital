import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { User } from "~/.server/domain/entity";

export function useMatchesData(
  id: string
): unknown | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: User): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root") as { user: User };
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}