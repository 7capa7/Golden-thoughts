import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { GoldenThoughtSchema } from "../schema/GoldenThought.schema";
import deserializeUser from "../middleware/deserializeUser";
import {
  createGoldenThoughtHandler,
  getGoldenThoughtByIdHandler,
  getGoldenThoughtsHandler,
  setGoldenThoughtDone,
} from "../controller/goldenThought.controller";
import checkIfAdmin from "../middleware/checkIfAdmin";
import { deleteGoldenThoughtHandler } from "../controller/goldenThought.controller";

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

router.get(
  "/api/auth/golden-thought",
  deserializeUser,
  getGoldenThoughtByIdHandler
);

router.delete(
  "/api/auth/admin/golden-thought",
  deserializeUser,
  checkIfAdmin,
  deleteGoldenThoughtHandler
);

router.patch(
  "/api/auth/admin/done",
  deserializeUser,
  checkIfAdmin,
  setGoldenThoughtDone
);
const goldeThoughtRouter = router;
export default goldeThoughtRouter;
