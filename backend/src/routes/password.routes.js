import { Router } from "express";
import {
  CreatePassword,
  updatePassword,
  deletePassword,
  getAllUserPasswords,
} from "../controllers/password.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/createPassword").post(verifyJWT, CreatePassword);
router
  .route("/c/:passwordId")
  .patch(verifyJWT, updatePassword)
  .delete(verifyJWT, deletePassword);
router.route("/user/:userId").get(getAllUserPasswords);
