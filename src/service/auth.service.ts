import { omit } from "lodash";
import { User } from "../entity/User";
import { signJwt } from "../utils/jwt";

export function signAccessToken(user: User) {
  const payload = omit({id: user.id, email: user.email});

  const accessToken = signJwt(payload, {
    expiresIn: "120m",
  });

  return accessToken;
}
