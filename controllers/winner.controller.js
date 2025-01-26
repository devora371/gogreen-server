const Winners = require("../models/winner.model");
const User = require("../models/user.model");

const winnerController = {
  //create winner from admin
  async createWinners(req, res) {
    try {
      // Ensure req.body.winners is an array containing exactly 11 winner objects
      const winners = req.body.winnerList;
      console.log("winners", req.body);

      if (!Array.isArray(winners) || winners.length !== 11) {
        return res.status(400).json({
          error: "Invalid winners array. It must contain exactly 11 winners.",
        });
      }

      // Validate the data if needed

      // Delete existing winners
      await Winners.deleteMany({});

      // Save the new winners to the database
      const savedWinners = await Winners.create(winners);

      res.json(savedWinners);
    } catch (error) {
      console.error("Error saving winners:", error);
      res.status(500).json({ error: "Winner could not be created" });
    }
  },

  //get winner to store in admin
  async fetchRandomUsersByAdmin(req, res) {
    try {
      const totalUsers = await User.countDocuments({});
      const randomIndices = Array.from({ length: 11 }, () =>
        Math.floor(Math.random() * totalUsers)
      );

      console.log("randomIndices", randomIndices);

      const randomUsers = await User.find().limit(11).skip(randomIndices[0]);

      // Extract relevant user information
      const loggedInUserMobile = req.loggedInUserMobile;
      console.log("randomUsers", randomUsers);
      // Modify formattedUsers array based on the logged-in user's mobile number
      const formattedUsers = randomUsers.map((user) => {
        const firstCoupon =
          user.mobile === loggedInUserMobile ? user.firstCoupon : "*********";
        const [extractedFirstCoupon] = user.couponNumber || [];

        return {
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          firstCoupon: extractedFirstCoupon || firstCoupon,
        };
      });
      const response = {
        count: formattedUsers.length,
        users: formattedUsers,
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching random users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = winnerController;
