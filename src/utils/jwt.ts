import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
    object: Object,
    options?: jwt.SignOptions | undefined
  ) {
    const signingKey = Buffer.from(
      config.get<string>('signingKey'),
      "base64"
    ).toString("ascii");
  
    return jwt.sign(object, signingKey, {
      ...(options && options),
      algorithm: "HS256",
    });
  }

  export function verifyJwt<T>(
    token: string,
  ): T | null {
    const key = Buffer.from(config.get<string>("signingKey"), "base64").toString(
      "ascii"
    );
  
    try {
      const decoded = jwt.verify(token, key) as T;
      return decoded;
    } catch (e) {
      return null;
    }
  }