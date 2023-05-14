import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { registerHandler } from "../controller/auth.controller";

const router = Router();

router.post(
  "/api/register",
  validateResource(createUserSchema),
  registerHandler
);

const authRouter = router;
export default authRouter;
