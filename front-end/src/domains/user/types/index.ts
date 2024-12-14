import { z } from "zod";
import { userSchema } from "../schema";

export type User = z.infer<typeof userSchema>;
export type AdminUser = Omit<User, "createdAt" | "updatedAt">;
export type UserWithoutPassword = Omit<User, "password">;
