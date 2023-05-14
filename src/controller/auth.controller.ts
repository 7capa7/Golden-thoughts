import { Request, Response } from "express";
import { CreateUserInput, UserDto } from "../schema/user.schema";
import { createUser } from "../service/auth.service";
import { User } from "../entity/User";

export async function registerHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    const userDto = mapUserToUserDto(user);
    return res.status(200).json(userDto).send();
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY" || error.code === "23505")
      return res.status(409).json({
        message: "user already exists",
        code: 409
      }).send();
    else return res.status(500).send("Server error");
  }
}

const mapUserToUserDto = (user: User): UserDto => {
  return { id: user.id, email: user.email, name: user.name };
};
