import { body, validationResult } from 'express-validator';

export const validateTask = [
  body("title").notEmpty().withMessage("Title is required"),
  body("status")
    .optional()
    .isIn(["not-started", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().toDate(),
  body("category").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];