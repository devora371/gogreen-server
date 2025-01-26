const User = require("../models/user.model");
const Agent = require("../models/agent.model");
const Winners = require("../models/winner.model");
const ContestModel = require("../models/metaInfo.model");

// const generateUserRandomPassword = require("../helpers/password");
const generateCouponNumber = require("../helpers/couponNumber");
const { generateUserRandomPassword } = require("../helpers/password");
const mongoose = require("mongoose");
const userController = {
  // for single coupons
  // async createUserByAgent(req, res) {
  //   try {
  //     const {
  //       agentId,
  //       firstName,
  //       lastName,
  //       mobile,
  //       email,
  //       role,
  //       couponNumber,
  //       couponAmt,
  //       // status,
  //       paymentMode,
  //       couponPaymentStatus,
  //     } = req.body;

  //     const password = generateUserRandomPassword(firstName, 12);
  //     console.log("password", password);

  //     // const couponNumber = generateCouponNumber(firstName, lastName, mobile);

  //     const isMobileUnique = await User.exists({ mobile });
  //     console.log("couponNumber", couponNumber);
  //     console.log("mobile", mobile);
  //     if (!isMobileUnique) {
  //       const user = new User({
  //         agentId,
  //         firstName,
  //         lastName,
  //         email,
  //         password,
  //         mobile,
  //         couponAmt,
  //         paymentMode,
  //         couponPaymentStatus,
  //         role,

  //         // status,
  //       });

  //       // Save the user to get the _id
  //       const savedUser = await user.save();

  //       // Generate unique coupon number
  //       const couponNumber = generateCouponNumber(
  //         firstName,
  //         lastName,
  //         mobile,
  //         savedUser._id
  //       );

  //       // Update the user with the generated coupon number
  //       savedUser.couponNumber = couponNumber;
  //       const updatedUser = await savedUser.save();

  //       res.status(201).json({ message: "User created", data: updatedUser });
  //     } else {
  //       res.status(400).json({ message: "Mobile number is already exist" });
  //     }
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     res
  //       .status(500)
  //       .json({ message: "User not created", error: error.message });
  //   }

  //   //   const user = new User({
  //   //     agentId,
  //   //     firstName,
  //   //     lastName,
  //   //     email,
  //   //     password,
  //   //     mobile,
  //   //     couponNumber,
  //   //     paymentMode,
  //   //     couponPaymentStatus,
  //   //     role,
  //   //     status,
  //   //   });

  //   //   const savedUser = await user.save();

  //   //   res.status(201).json({ message: "User created", data: savedUser });
  //   //   console.log("user", savedUser);
  //   // } catch (error) {
  //   //   console.error("Error creating user:", error);
  //   //   res
  //   //     .status(500)
  //   //     .json({ message: "User not created", error: error.message });
  //   // }
  // },

  async createUserByAgent(req, res) {
    try {
      const {
        agentId,
        firstName,
        lastName,
        mobile,
        email,
        role,
        occupation,
        couponCount,
        couponAmt,
        paymentMode,
        couponPaymentStatus
      } = req.body;

      const password = generateUserRandomPassword(firstName, 12);
      console.log("password", password);

      const isMobileUnique = await User.exists({ mobile });
      console.log("couponCount", couponCount);
      console.log("mobile", mobile);

      if (!isMobileUnique) {
        const user = new User({
          agentId,
          firstName,
          lastName,
          email,
          password,
          mobile,
          occupation,
          couponCount,
          couponAmt,
          paymentMode,
          couponPaymentStatus,
          role,
          couponNumber: []
        });

        // Save the user to get the _id
        const savedUser = await user.save();

        // Generate an array of unique coupon numbers and calculate the total amount
        const couponNumbers = [];
        let totalAmount = 0;

        for (let i = 0; i < couponCount; i++) {
          const couponNumber = generateCouponNumber(
            firstName,
            lastName,
            mobile,
            savedUser._id
          );

          couponNumbers.push(couponNumber);
          // totalAmount += couponAmt;
        }
        totalAmount += couponAmt * couponCount;

        // Update the user with the generated coupon numbers and total amount
        savedUser.couponNumber = couponNumbers;
        savedUser.couponAmt = totalAmount;

        const updatedUser = await savedUser.save();

        res.status(201).json({ message: "User created", data: updatedUser });
      } else {
        res.status(400).json({ message: "Mobile number is already exist" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ message: "User not created", error: error.message });
    }
  },
  updateUserByAgent(req, res) {
    const { userId } = req.params;
    const updatedUserData = req.body;

    // Extract the fields you want to update
    const { paymentMode, couponPaymentStatus, email, role, occupation } =
      updatedUserData;

    // Create an object with the fields you want to update
    const updatedFields = {
      paymentMode,
      couponPaymentStatus,
      email,
      occupation,
      role
    };

    // Remove undefined or null values from the updatedFields object
    const cleanedUpdatedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    console.log("updatedFields", cleanedUpdatedFields);
    console.log("userId", userId);

    if (Object.keys(updatedFields).length > 0) {
      User.updateOne(
        { _id: userId },
        { $set: cleanedUpdatedFields },
        { new: true }
      )
        .then((result) => {
          if (result.nModified === 0) {
            res.status(200).send({ message: "No fields were updated" });
          } else {
            res
              .status(200)
              .send({ message: "User updated by Super admin", data: result });
            console.log("Request Body:", result);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(404).send({ message: "User not updated", error: err });
        });
    } else {
      res.status(404).send({ message: "No fields provided for update" });
    }
  },
  deleteUserByAgent(req, res) {
    const { userId } = req.params;

    User.findByIdAndDelete(userId)
      .then((result) => {
        res
          .status(200)
          .send({ message: "User deleted by Super admin", data: result });
      })
      .catch((err) => {
        console.error(err);
        res.status(404).send({ message: "User not deleted", error: err });
      });
  },

  fetchSingleUserByAgent(req, res) {
    const { userId } = req.params;

    User.findById(userId)
      .populate({
        path: "agentId",
        select: "_id agentName mobile"
      })
      .exec()
      .then((result) => {
        if (result === null) {
          res.status(200).send({ message: "User Not available" });
        } else {
          res
            .status(200)
            .send({ message: "User fetched by Superadmin", data: result });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(404).send({ message: "User not fetched", error: err });
      });
  },

  // fetch all user without agent id  is used for client
  fetchAllUser(req, res) {
    User.find()
      .sort({ createdAt: -1 })

      .populate({
        path: "agentId",
        select: "_id agentName mobile"
      })
      .select(
        "firstName password lastName email mobile couponPaymentStatus paymentMode role couponAmt couponCount couponNumber createdAt occupation"
      )
      .exec()
      .then((result) => {
        if (!result || result.length === 0) {
          throw new Error("User not available");
        }
        res.status(200).send({
          message: "user list fetched with agent Name",
          data: result
        });
        console.log("fetchUser", result.length);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "users not available", error: err });
      });
  },

  // fetch 2000 user without agent id  is used for client
  fetchTwoThousandUser(req, res) {
    const users = User.find()
      .sort({ createdAt: -1 })
      .limit(2000)
      .populate({
        path: "agentId",
        select: "_id agentName mobile"
      })
      .select(
        "firstName password lastName email mobile couponPaymentStatus paymentMode role couponAmt couponCount couponNumber createdAt occupation"
      )
      .exec()
      .then((result) => {
        if (!result || result.length === 0) {
          throw new Error("User not available");
        }

        const updatedResult = result.map((user) => ({
          ...user.toObject(),
          agentName: user.agentId ? user.agentId.agentName : null
        }));

        res.status(200).send({
          message: "user list fetched with agent Name",
          // data: result
          data: updatedResult
        });
        console.log("fetchTwoThousandUser", result.length);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "users not available", error: err });
      });
  },

  // fetchAllUser(req, res) {
  //   const { status } = req.query;

  //   const filter = {
  //     $or: [{ status: 0 }, { status: 1 }],
  //   };

  //   if (status) filter.status = status;

  //   User.find(filter)
  //     .populate({
  //       path: "agentId",
  //       select: "_id agentName mobile",
  //     })
  //     .exec()
  //     .then((result) => {
  //       if (!result) throw new Error("User not avilable");
  //       res.status(200).send({ message: "user list fetched", data: result });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(404).send({ message: "users not available", error: err });
  //     });
  // }, //fetch all User

  fetchAllUsersByAgent(req, res) {
    const agentId = req.params.agentId;
    console.log("AgentId:", agentId);

    User.find({ agentId })
      .populate({
        path: "agentId",
        select: "_id agentName mobile"
      })
      .exec()
      .then((result) => {
        res
          .status(200)
          .send({ message: "Users fetched by agent", data: result });
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(404).send({ message: "Users not fetched", error: err });
      });
  },

  //advance serch for date
  getUserListByDateRange(req, res) {
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };

    try {
      const { fromDate, toDate, agentId } = req.query;
      console.log("date range and agentId:", req.query);

      // Check if fromDate and toDate are valid date strings
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "Invalid date parameters" });
      }

      // Parse the date strings to Date objects
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
      };

      const startDate = parseDate(fromDate);
      const endDate = parseDate(toDate);

      // Check if the Date objects are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      // Adjust the endDate to include the entire day
      endDate.setHours(23, 59, 59, 999);

      // Construct the query object
      const query = {
        createdAt: { $gte: startDate, $lte: endDate }
      };

      // If agentId is provided, add it to the query
      if (agentId) {
        query.agentId = agentId;
      }
      console.log("Query:", query);
      // Fetch users based on the query
      const fetchUserList = async () => {
        try {
          // Use await to wait for the promise to resolve
          const userList = await User.find(query)
            .populate("agentId", "_id agentName")
            .exec();

          // Log the date range and user list to the console
          console.log("Date Range:", {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          });
          // Log the user list to the console
          console.log("User List date range:", userList);
          console.log("User List date range:", userList.length);

          // Send the response
          res.status(200).json({
            message: `User List fetched from ${formatDate(
              startDate
            )} to ${formatDate(endDate)}`,
            count: userList.length,
            // data: userList
            data: userList.map((user) => ({
              ...user.toObject(),
              agentName: user.agentId.agentName
            }))
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          res.status(500).json({ error: "Error fetching user data" });
        }
      };

      // Call the async function
      fetchUserList();
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // getUserListByDateRange(req, res) {
  //   const formatDate = (date) => {
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  //     const year = date.getFullYear();

  //     return `${day}/${month}/${year}`;
  //   };

  //   try {
  //     const { fromDate, toDate } = req.query;
  //     console.log("date range :", req.query);

  //     // Check if fromDate and toDate are valid date strings
  //     if (!fromDate || !toDate) {
  //       return res.status(400).json({ error: "Invalid date parameters" });
  //     }

  //     // Parse the date strings to Date objects
  //     const parseDate = (dateString) => {
  //       const [day, month, year] = dateString.split("/");
  //       return new Date(`${year}-${month}-${day}`);
  //     };

  //     const startDate = parseDate(fromDate);
  //     const endDate = parseDate(toDate);

  //     // Check if the Date objects are valid
  //     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //       return res.status(400).json({ error: "Invalid date format" });
  //     }

  //     // Adjust the endDate to include the entire day
  //     endDate.setHours(23, 59, 59, 999);

  //     // Fetch users based on the date range
  //     const fetchUserList = async () => {
  //       // Use await to wait for the promise to resolve
  //       const userList = await User.find({
  //         createdAt: { $gte: startDate, $lte: endDate }
  //       })
  //         .populate("agentId", "_id agentName")
  //         .exec();

  //       // Log the user list to the console
  //       console.log("User List date range:", userList);
  //       console.log("User List date range:", userList.length);

  //       // Send the response
  //       res.status(200).json({
  //         message: `User List fetched from ${formatDate(
  //           startDate
  //         )} to ${formatDate(endDate)}`,
  //         count: userList.length,
  //         data: userList
  //       });
  //     };

  //     // Call the async function
  //     fetchUserList();
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  // getUserListByDateRange(req, res) {
  //   const formatDate = (date) => {
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  //     const year = date.getFullYear();

  //     return `${day}/${month}/${year}`;
  //   };

  //   try {
  //     const { fromDate, toDate } = req.query;
  //     console.log("date range :", req.query);

  //     // Check if fromDate and toDate are valid date strings
  //     if (!fromDate || !toDate) {
  //       return res.status(400).json({ error: "Invalid date parameters" });
  //     }

  //     // Parse the date strings to Date objects
  //     const parseDate = (dateString) => {
  //       const [day, month, year] = dateString.split("/");
  //       return new Date(`${year}-${month}-${day}`);
  //     };

  //     const startDate = parseDate(fromDate);
  //     const endDate = parseDate(toDate);

  //     // Check if the Date objects are valid
  //     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //       return res.status(400).json({ error: "Invalid date format" });
  //     }

  //     // Adjust the endDate to include the entire day
  //     endDate.setHours(23, 59, 59, 999);

  //     // Fetch users based on the date range
  //     const fetchUserList = async () => {
  //       // Use await to wait for the promise to resolve
  //       const userList = await User.find({
  //         createdAt: { $gte: startDate, $lte: endDate }
  //       })
  //         .populate("agentId", "_id agentName")
  //         .exec();

  //       // Log the user list to the console
  //       console.log("User List date range:", userList);
  //       console.log("User List date range:", userList.length);

  //       // Send the response
  //       res.status(200).json({
  //         message: `User List fetched from ${formatDate(
  //           startDate
  //         )} to ${formatDate(endDate)}`,
  //         count: userList.length,
  //         data: userList
  //       });
  //     };

  //     // Call the async function
  //     fetchUserList();
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  //advance serch fetch user last 30 days
  getUserListBylatestThirtyDays(req, res) {
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };
    try {
      // Fetch users for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo;
      const endDate = new Date();

      // Adjust the endDate to include the entire day
      endDate.setHours(23, 59, 59, 999);

      // Fetch users based on the date range
      User.find({
        createdAt: { $gte: startDate, $lte: endDate }
      })
        .exec()
        .then((userList) => {
          res.status(200).json({
            message: `Data fetched for the last 30 days from ${formatDate(
              startDate
            )} to ${formatDate(endDate)}`,
            data: userList,
            count: userList.length
          });
          console.log("latestThirtyDays users", userList.length);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  //advance serch fetch user on moble number
  async searchUserByMobile(req, res) {
    try {
      const { mobile } = req.body; // Extract mobile number from req.body

      console.log("mobileNumber", mobile);

      // Find user by mobile number
      const user = await User.findOne({ mobile: mobile });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User found:", user);

      // Convert agentId to string
      const agentIdString = user.agentId.toString();

      console.log("AgentId string:", agentIdString);

      // Find agent by agentId
      const agent = await Agent.findById(agentIdString).select("agentName");

      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      console.log("Agent found:", agent);

      return res.status(200).json({
        message: "User found successfully",
        data: {
          ...user.toObject(),
          agentName: agent.agentName
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  // async searchUserByMobile(req, res) {
  //   try {
  //     const { mobile } = req.body; // Extract mobile number from req.body

  //     console.log("mobileNumber", mobile);

  //     // Assuming your User model has a 'findByMobile' function
  //     const user = await User.findOne({ mobile: mobile });
  //     console.log("user mobile", user);
  //     console.log("userid mobile", user?.agentId.toString());

  //     const agentIdNew = user?.agentId.toString();

  //     obj = { _id: user?.agentId };
  //     const agentData = await Agent.findOne(obj);
  //     console.log("agent mobile", agentData);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     console.log("mobile user ", user);
  //     return res.status(200).json({
  //       message: "User found successfully",
  //       // data: user
  //       data: user.map((user) => ({
  //         ...user.toObject(),
  //         agentName: agent
  //       }))
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // },

  // fetch user based on agent from dropdown
  async fetchAllUsersBasedOnAgentId(req, res) {
    const { agentId } = req.body;
    console.log("AgentId:", agentId);

    if (!agentId) {
      return res.status(400).send({ message: "AgentId is required" });
    }

    try {
      // Fetch agent details based on agentId
      const agent = await Agent.findById(agentId).select("agentName mobile");
      console.log("Fetched Agent:", agent);

      if (!agent) {
        return res.status(404).send({ message: "Agent not found" });
      }

      // Fetch users associated with the agent and populate agent details
      const users = await User.find({ agentId })
        .populate({
          path: "agentId",
          select: "agentName"
        })
        .exec();

      res.status(200).send({
        message: `${users.length} Users fetched by agent`,
        count: users.length,
        data: users.map((user) => ({
          ...user.toObject(),
          agentName: user.agentId.agentName,
          agentMobile: agent.mobile
        }))
      });
    } catch (err) {
      console.error("Error:", err);
      res
        .status(500)
        .send({ message: "Error fetching users", error: err.message });
    }
  },

  // controller for deployed version 1
  // async searchUserByMobile(req, res) {
  //   try {
  //     const { mobile } = req.body; // Extract mobile number from req.body

  //     console.log("mobileNumber", req.body);

  //     const user = await User.findOne({ mobile: mobile });

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     console.log("mobile user ", user);
  //     return res
  //       .status(200)
  //       .json({ message: "User found successfully", data: user });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // },

  // generateWinners

  // async fetchRandomUsersByAgent(req, res) {
  //   try {
  //     const totalUsers = await User.countDocuments({});
  //     const randomIndices = Array.from({ length: 11 }, () =>
  //       Math.floor(Math.random() * totalUsers)
  //     );

  //     const randomUsers = await User.find().limit(11).skip(randomIndices[0]);

  //     // Extract relevant user information
  //     const loggedInUserMobile = req.loggedInUserMobile;

  //     // Modify formattedUsers array based on the logged-in user's mobile number
  //     const formattedUsers = randomUsers.map((user) => {
  //       return {
  //         name: `${user.firstName} ${user.lastName}`,
  //         mobile:
  //           user.mobile === loggedInUserMobile
  //             ? user.mobile
  //             : "****" + user.mobile.slice(-4),
  //         firstCoupon: user.firstCoupon,
  //       };
  //     });

  //     res.json(formattedUsers);
  //   } catch (error) {
  //     console.error("Error fetching random users:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  // generateWinners
  // async fetchRandomUsersByAgent(req, res) {
  //   try {
  //     const totalUsers = await Winners.countDocuments({});
  //     const randomIndices = Array.from({ length: 11 }, () =>
  //       Math.floor(Math.random() * totalUsers)
  //     );

  //     console.log("randomIndices", randomIndices);
  //     // Masking function for mobile numbers
  //     function maskMobile(mobile) {
  //       return "****" + mobile.slice(-4);
  //     }

  //     const randomUsers = await Winners.find().limit(11);
  //     // const randomUsers = await User.find().limit(11).skip(randomIndices[0]);
  //     // console.log("randomUsers", randomUsers);
  //     // Extract relevant user information
  //     const loggedInUserMobile = req.loggedInUserMobile;

  //     // Modify formattedUsers array based on the logged-in user's mobile number
  //     const formattedUsers = randomUsers.map((user) => {
  //       const maskedMobile =
  //         user.mobile === loggedInUserMobile
  //           ? user.mobile
  //           : maskMobile(user.mobile);
  //       // const firstCoupon =
  //       //   user.mobile === loggedInUserMobile ? user.firstCoupon : "*********";

  //       // Extract the first coupon from the user object
  //       const [extractedFirstCoupon] = user.couponNumber || [];

  //       return {
  //         name: `${user.firstName} ${user.lastName}`,
  //         mobile: maskedMobile,
  //         // firstCoupon: extractedFirstCoupon || firstCoupon,
  //         firstCoupon: user.firstCoupon,
  //       };
  //     });
  //     // const formattedUsers = randomUsers.map((user) => {
  //     //   const maskedMobile =
  //     //     user.mobile === loggedInUserMobile
  //     //       ? user.mobile
  //     //       : maskMobile(user.mobile);
  //     //   const maskedFirstCoupon =
  //     //     user.mobile === loggedInUserMobile ? user.firstCoupon : "*********"; // Replace with your generic masked value for coupons

  //     //   return {
  //     //     name: `${user.firstName} ${user.lastName}`,
  //     //     // name: maskedName,
  //     //     mobile: maskedMobile,

  //     //     firstCoupon: maskedFirstCoupon,
  //     //   };
  //     // });

  //     res.json(formattedUsers);
  //   } catch (error) {
  //     console.error("Error fetching random users:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  async fetchRandomUsersByAgent(req, res) {
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    };

    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    try {
      // Find the latest contest based on the contest result date
      const latestContest = await ContestModel.findOne(
        {},
        {},
        { sort: { contestResultDate: -1 } }
      );

      if (!latestContest) {
        // If there is no contest found, return empty response
        return res.json([]);
      }

      const next30Days = new Date(latestContest.contestResultDate);
      next30Days.setDate(next30Days.getDate() + 30);

      console.log("latestContest", latestContest.contestResultDate);

      // Check if the current date matches the latest contest result date
      const currentDate = new Date();
      const contestResultDate = parseDate(latestContest.contestResultDate);

      console.log("currentDate", formatDate(currentDate));
      console.log("contestResultDate", formatDate(contestResultDate));

      if (
        currentDate.getTime() < contestResultDate.getTime() ||
        currentDate.getTime() > next30Days.getTime()
      ) {
        // If the current date is not within the next 30 days, return empty response
        return res.json([]);
      }

      // Proceed to fetch random users if the result date matches
      const totalUsers = await Winners.countDocuments({});
      const randomIndices = Array.from({ length: 11 }, () =>
        Math.floor(Math.random() * totalUsers)
      );

      console.log("randomIndices", randomIndices);

      // Masking function for mobile numbers
      function maskMobile(mobile) {
        return "****" + mobile.slice(-4);
      }

      const randomUsers = await Winners.find().limit(11);

      const loggedInUserMobile = req.loggedInUserMobile;

      // Modify formattedUsers array based on the logged-in user's mobile number
      const formattedUsers = randomUsers.map((user) => {
        const maskedMobile =
          user.mobile === loggedInUserMobile
            ? user.mobile
            : maskMobile(user.mobile);

        return {
          name: `${user.firstName} ${user.lastName}`,
          mobile: maskedMobile,
          firstCoupon: user.firstCoupon
        };
      });

      res.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching random users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // total amount

  async getTotalCouponAmount(req, res) {
    try {
      // Fetch all users
      const users = await User.find();

      // Calculate total coupon amount
      let totalCouponAmount = 0;
      letcouponAmount = 0;
      users.forEach((user) => {
        const couponAmount = user.couponAmt;
        // const couponAmount = user.couponAmt * user.couponCount;
        totalCouponAmount += couponAmount;
        console.log("user.couponAmt", user.couponAmt);
        console.log("user.couponCount", user.couponCount);
        console.log("totalCouponAmount", totalCouponAmount);
      });

      res.status(200).json({
        success: true,
        message: "Total coupon amount calculated successfully",
        data: {
          totalCouponAmount: totalCouponAmount
        }
      });
    } catch (error) {
      console.error("Error calculating total coupon amount:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  //total coupon count
  async calculateTotalCouponCount(req, res) {
    try {
      // Fetch all user documents
      const users = await User.find({}, "couponCount");

      // Calculate total coupon count
      let totalCouponCount = 0;
      users.forEach((user) => {
        totalCouponCount += user.couponCount;
      });

      // Return the total coupon count
      res.status(200).json({
        data: totalCouponCount,
        message: `Total${totalCouponCount} coupons Feched from database`
      });
    } catch (error) {
      // Handle error
      console.error(error);
      res.status(500).json({ message: "Error calculating total coupon count" });
    }
  }
};

module.exports = userController;
