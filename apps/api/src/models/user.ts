export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export function createUser(input: { email: string; id?: string }): User {
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("email is required");
  }

  return {
    id: input.id ?? crypto.randomUUID(),
    email,
    createdAt: new Date(),
  };
}
