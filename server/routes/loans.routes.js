import express from "express";
import {authenticate} from '../middlewares/auth.middleware.js';
import { 
    createLoan,
     getLoans,
      returnLoan,
       getMyLoans,
        getOverdueLoans,
         getLoanStats 
        } from "../controllers/loans.controller.js";
import {authorize} from '../middlewares/role.middleware.js';

const router = express.Router();

router.post("/", authenticate, createLoan);
router.get("/", authenticate, authorize("admin", "librarian"), getLoans);
router.get("/my", authenticate, getMyLoans);
router.get("/overdue", authenticate, authorize("admin", "librarian"), getOverdueLoans);
router.get("/stats", authenticate, authorize("admin", "librarian"), getLoanStats);
router.put("/:id/return", authenticate, returnLoan);

export default router;