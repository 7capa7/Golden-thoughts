import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { findUserById } from "../service/user.service";
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );

  const errorMessage = "Invalid Token";

  if (!accessToken) {
    return res
      .status(401)
      .json({
        message: errorMessage,
        code: 401,
      })
      .send();
  }

  const decoded: any = verifyJwt(accessToken);

  if (!decoded || !decoded?.id) {
    return res
      .status(401)
      .json({
        message: errorMessage,
        code: 401,
      })
      .send();
  }

  const user = await findUserById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({
        message: errorMessage,
        code: 401,
      })
      .send();
  }

  res.locals.user = user;

  return next();
};

export default deserializeUser;
