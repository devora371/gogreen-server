const router = require("express").Router();
const multer = require("multer");
const authorize = require("../helpers/authorize");
const {
  createUser,
  updateUser,
  deleteUser,
  fetchAllUser,
  fetchOneUser,
} = require("../controllers/superadmin.controller");

// Define the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/avatars"); // Specify the directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("avatar"), createUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", fetchOneUser);
router.get("/", fetchAllUser);
// router.get("/", authorize(["admin"]), fetchAllUser);

module.exports = router;
