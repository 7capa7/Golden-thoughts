import { object, string, TypeOf } from "zod";

export const RegisterSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password should be at least 6 characters long"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    name: string({
      required_error: "Name is required",
    }).min(1, "name should be at least 1 character long"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const LoginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email or password"),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export type LoginInput = TypeOf<typeof LoginSchema>["body"];
export type RegisterInput = TypeOf<typeof RegisterSchema>["body"];
