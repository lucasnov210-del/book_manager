import express from "express";
import {authenticate} from '../middlewares/auth.middleware.js';
import { getAllCategories } from "../controllers/categories.controller.js";
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get("/", authenticate, authorize("admin", "librarian"), getAllCategories);

export default router;