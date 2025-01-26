const express = require("express");
const router = require("express").Router();

const authorize = require("../helpers/authorize");
const {
  createContestEntry,
  fetchAllContestEntry,
  updateContestEntry,
} = require("../controllers/metaInfo.controller");

// Routes
router.post("/", createContestEntry);
router.put("/:id", updateContestEntry);

router.get("/", fetchAllContestEntry);
// router.get("/", authorize(["admin"]), fetchAllAgent);

module.exports = router;
