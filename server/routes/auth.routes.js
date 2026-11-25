import express from "express";
import {login, register, getMe, getAllUsers} from '../controllers/auth.controller.js';
import {authenticate} from '../middlewares/auth.middleware.js';
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getMe);
router.get("/users", authenticate, authorize("admin", "librarian"), getAllUsers);

export default router;