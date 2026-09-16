export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  createdAt: Date;
}

export function createUser(input: {
  email: string;
  id?: string;
  passwordHash?: string;
}): User {
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("email is required");
  }

  return {
    id: input.id ?? crypto.randomUUID(),
    email,
    passwordHash: input.passwordHash,
    createdAt: new Date(),
  };
}
