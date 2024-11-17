const path = require("path");
const multer = require("multer");

const tempDir = path.join(process.cwd(), "temp");
const avatarsDir = path.join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const extentionsWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypewhiteList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const upload = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (
      !extentionsWhiteList.includes(extension) ||
      !mimetypewhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = { avatarsDir, upload };
