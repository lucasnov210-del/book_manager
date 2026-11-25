import express from "express";
import {
    getBooks,
    getBookById,
    createBook, 
    updateBook,
    deleteBook 
    } from '../controllers/books.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get("/", getBooks);
router.get("/:id" , authenticate, getBookById);
router.post("/" , authenticate, authorize("admin", "librarian"),  createBook);
router.put("/:id" , authenticate, authorize("admin", "librarian"),  updateBook);
router.delete("/:id" , authenticate, authorize("admin", "librarian"),  deleteBook);

export default router;