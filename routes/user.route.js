const express = require("express");
const router = require("express").Router();
const authenticate = require("../helpers/authenticate");
const authorize = require("../helpers/authorize");
const {
  createUserByAgent,
  deleteUserByAgent,
  fetchAllUsersByAgent,
  fetchSingleUserByAgent,
  updateUserByAgent,
  fetchRandomUsersByAgent,
  fetchAllUser,
  fetchTwoThousandUser,
  getUserListByDateRange,
  getUserListBylatestThirtyDays,
  searchUserByMobile,
  fetchAllUsersBasedOnAgentId,
  getTotalCouponAmount,
  calculateTotalCouponCount
} = require("../controllers/user.controller");

// Create user by agent
router.post("/", createUserByAgent);

// router.put(
//   "/updateuser/:userId",
//   authenticate,
//   authorize(["superadmin"]),
//   updateUserByAgent
// );
router.put("/:userId", updateUserByAgent);
router.delete("/:userId", deleteUserByAgent);
router.get("/:userId", fetchSingleUserByAgent);
// fetch all users
router.get("/", authorize(["super admin"]), fetchAllUser);

// fetch 2000 user onlys
router.get(
  "/fetchTwoThousandUsers/users",

  fetchTwoThousandUser
);

//fetched user based on date range
router.get("/fetchByDateRange/users", getUserListByDateRange);
//fetched user based on last 30 days
router.get("/fetchBylatestThirtyDays/users", getUserListBylatestThirtyDays);
//fetched user based on mobile
router.post("/fetchedbyMobile", searchUserByMobile);

router.get("/getTotalCouponAmount/revenue", getTotalCouponAmount);

router.get("/calculateTotalCouponCount/couponcount", calculateTotalCouponCount);

router.get("/fetchAll/:agentId", fetchAllUsersByAgent);

router.get("/fetchRandomUsers/winners", fetchRandomUsersByAgent);

router.post("/fetchAllUser", fetchAllUsersBasedOnAgentId);
module.exports = router;
