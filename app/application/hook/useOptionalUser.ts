import { User } from "~/.server/domain/entity";
import { useMatchesData } from "./useMatchesData";

function isUser(user: User): user is User {
    return user && typeof user === "object" && typeof user.email === "string";
  }
  
export function useOptionalUser(): User | undefined {
    const data = useMatchesData("root") as { user: User };
    if (!data || !isUser(data.user)) {
        return undefined
    }
    return data.user;
}