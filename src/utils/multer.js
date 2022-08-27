import multer, { memoryStorage } from "multer";
import { extname } from "path";

export default multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log(file);
    let ext = extname(file.originalname);
    console.log(ext);
    if (
      ext == "..xlsx" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return;
    }
  },
});
