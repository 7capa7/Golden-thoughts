import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { LoginSchema, RegisterSchema } from "../schema/auth.schema";
import { loginHandler, registerHandler } from "../controller/auth.controller";

const router = Router();

router.post(
  "/api/register",
  validateResource(RegisterSchema),
  registerHandler
);

router.post(
  "/api/login",
  validateResource(LoginSchema),
  loginHandler
);

const authRouter = router;
export default authRouter;
