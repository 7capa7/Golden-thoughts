import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "../schema/auth.schema";
import { UserDto } from "../schema/user.schema";
import { createUser, findUserByEmail } from "../service/user.service";
import { User } from "../entity/User";
import { signAccessToken } from "../service/auth.service";

export async function registerHandler(
  req: Request<{}, {}, RegisterInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    const userDto = mapUserToUserDto(user);
    return res.status(201).json(userDto).send();
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY" || error.code === "23505")
      return res
        .status(409)
        .json({
          message: "user already exists",
          code: 409,
        })
        .send();
    else return res.status(500).send("Server error");
  }
}

export async function loginHandler(
  req: Request<{}, {}, LoginInput>,
  res: Response
) {
  const errorMessage = "Invalid email or password";
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({
        message: errorMessage,
        code: 401,
      })
      .send();
  }
  const isVerified = await user.verifyPassword(password);
  if (!isVerified) {
    return res
      .status(401)
      .json({
        message: errorMessage,
        code: 401,
      })
      .send();
  }

  const accessToken = signAccessToken(user);
  return res.status(200).json({ accessToken }).send();
}

const mapUserToUserDto = (user: User): UserDto => {
  return { id: user.id, email: user.email, name: user.name };
};
