import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { GoldenThoughtSchema } from "../schema/goldenThought.schema";
import deserializeUser from "../middleware/deserializeUser";
import {
  createGoldenThoughtHandler,
  getGoldenThoughtsHandler,
} from "../controller/goldenThought.controller";

const router = Router();

router.post(
  "/api/auth/golden-thought",
  deserializeUser,
  validateResource(GoldenThoughtSchema),
  createGoldenThoughtHandler
);
router.get(
  "/api/auth/golden-thoughts",
  deserializeUser,
  getGoldenThoughtsHandler
);

const goldeThoughtRouter = router;
export default goldeThoughtRouter;
