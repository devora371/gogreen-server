const router = require("express").Router();
const {
  createWinners,
  fetchRandomUsersByAdmin,
} = require("../controllers/winner.controller");

router.post("/", createWinners);
router.get("/", fetchRandomUsersByAdmin);

module.exports = router;
