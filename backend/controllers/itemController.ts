import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import itemModel from "../models/itemModel.js";
import {
  Item,
  ApiResponse,
  ItemFilters,
  CreateItemInput,
  UpdateItemInput,
} from "../types/index.js";

export const getItems = async (
  req: Request<{}, {}, {}, ItemFilters>,
  res: Response<ApiResponse<Item[]>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const items = await itemModel.findAll(req.query);
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    next(error);
  }
};

export const getItem = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Item>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    const item = await itemModel.findById(id);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (
  req: Request<{}, {}, CreateItemInput>,
  res: Response<ApiResponse<Item>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err: ValidationError) => ({
        msg: err.msg,
        path: "path" in err ? err.path : undefined,
      }));
      res.status(400).json({ success: false, errors: formattedErrors });
      return;
    }

    const item = await itemModel.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: Request<{ id: string }, {}, UpdateItemInput>,
  res: Response<ApiResponse<Item>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err: ValidationError) => ({
        msg: err.msg,
        path: "path" in err ? err.path : undefined,
      }));
      res.status(400).json({ success: false, errors: formattedErrors });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    const item = await itemModel.update(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    const deleted = await itemModel.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
