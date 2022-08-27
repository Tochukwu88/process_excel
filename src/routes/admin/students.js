import express from "express";

import Students from "../../controllers/admin/Student.js";

import upload from "../../utils/multer.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),

  Students.addStudents
);
router.get(
  "/",

  Students.getAllStudents
);
export default router;
