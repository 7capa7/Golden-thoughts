import { TypeOf, any, object, string, nullable } from "zod";

export const GoldenThoughtSchema = object({
  body: object({
    value: string({
      required_error: "Value of you thought is required!",
    }).min(5, "Your golden thought should be at least 5 characters long."),
    user: nullable(any()),
  }),
});

export type GoldenThoughtInput = TypeOf<typeof GoldenThoughtSchema>["body"];

export type GoldeThoughtDto = {
  readonly id: string;
  readonly value: string;
  readonly user: string;
  readonly isDone: boolean;
};
