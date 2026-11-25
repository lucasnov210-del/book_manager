import express from "express";
import cors from "cors";
import booksRoutes from "./routes/books.routes.js";
import authRoutes from "./routes/auth.routes.js";
import loansRoutes from "./routes/loans.routes.js";
import authorsRoutes from "./routes/authors.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Library Manager API fonctionne"
    });
});

app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/categories", categoriesRoutes);

export default app;