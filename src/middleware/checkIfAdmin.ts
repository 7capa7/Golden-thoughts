import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import Role from "../utils/Role";

const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  if (user.role != Role.ADMIN) {
    return res
      .status(403)
      .json({
        message: "Access forbidden",
        code: 403,
      })
      .send();
  }

  return next();
};

export default checkIfAdmin;
