import { Router } from "express";
import { body } from "express-validator";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const router = Router();

const itemValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be under 255 characters"),
  body("description").optional().trim(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", itemValidation, createItem);
router.put("/:id", itemValidation, updateItem);
router.delete("/:id", deleteItem);

export default router;
