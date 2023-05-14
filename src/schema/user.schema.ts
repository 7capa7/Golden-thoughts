import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
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

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type UserDto = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
}
