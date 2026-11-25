import express from "express";
import {authenticate} from '../middlewares/auth.middleware.js';
import { getAllAuthors } from "../controllers/authors.controller.js";
import {authorize} from '../middlewares/role.middleware.js';


const router = express.Router();

router.get("/", authenticate, authorize("admin", "librarian"), getAllAuthors);

export default router;