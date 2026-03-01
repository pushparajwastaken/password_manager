import { Router } from "express";
import {
  createPassword,
  deletePassword,
  getAllUserPasswords,
} from "../controllers/password.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/createPassword").post(verifyJWT, createPassword);
router.route("/c/:passwordId").delete(verifyJWT, deletePassword);

router.route("/user").post(verifyJWT, getAllUserPasswords);
export default router;
