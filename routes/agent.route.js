const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const authorize = require("../helpers/authorize");
const {
  createAgent,
  updateAgent,
  fetchOneAgent,
  deleteAgent,
  fetchAllAgent,
} = require("../controllers/agent.controller");

// Define the storage for multer

// Routes
router.post("/", createAgent);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);
router.get("/:id", fetchOneAgent);
router.get("/", fetchAllAgent);
// router.get("/", authorize(["admin"]), fetchAllAgent);

module.exports = router;
