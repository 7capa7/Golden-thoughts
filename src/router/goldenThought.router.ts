import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { GoldenThoughtSchema } from "../schema/GoldenThought.schema";
import deserializeUser from "../middleware/deserializeUser";
import { createGoldenThoughtHandler } from "../controller/goldenThought.controller";

const router = Router();

router.post(
  "/api/auth/golden-thought",
  deserializeUser,
  validateResource(GoldenThoughtSchema),
  createGoldenThoughtHandler
);

const goldeThoughtRouter = router;
export default goldeThoughtRouter;
