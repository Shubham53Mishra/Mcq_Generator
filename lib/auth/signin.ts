import { signIn } from "next-auth/react";

export const login = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};
