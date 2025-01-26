const ContestModel = require("../models/metaInfo.model");

const metaCtrl = {
  async createContestEntry(req, res) {
    try {
      // Extract contest data from the request body
      const {
        contestRules,
        termsAndConditions,
        awarenessData,
        contestResultDate,
        contestTitle,
        couponAmt,
        conteastPrize,
      } = req.body;

      // Create a new Contest entry with URLs
      const newContestEntry = new ContestModel({
        contestRules,
        awarenessData,
        termsAndConditions,
        contestResultDate,
        contestTitle,
        couponAmt,
        conteastPrize,
      });
      // Save the entry to the database
      await newContestEntry.save();
      // Respond with a success message
      res.status(201).json({
        message: "Contest created successfully",
        data: newContestEntry,
      });
      console.log("newContestEntry", newContestEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Contest not created " });
      console.log("error", error);
    }
  },

  // async updateContestEntry(req, res) {
  //   const contestId = req.params.id;
  //   try {
  //     // Extract contest data from the request body
  //     const { contestRules, termsAndConditions, resultDate, awarenessData } =
  //       req.body;

  //     // Check if contestId is provided
  //     if (!contestId) {
  //       return res
  //         .status(400)
  //         .json({ message: "Contest ID is required for updating" });
  //     }

  //     // Find the contest entry by ID
  //     const existingContestEntry = await ContestModel.findById(contestId);

  //     // Check if the contest entry exists
  //     if (!existingContestEntry) {
  //       return res.status(404).json({ message: "Contest entry not found" });
  //     }

  //     // Update the contest entry fields
  //     existingContestEntry.contestRules = contestRules;
  //     existingContestEntry.termsAndConditions = termsAndConditions;
  //     existingContestEntry.resultDate = resultDate;
  //     existingContestEntry.awarenessData = awarenessData;

  //     // Save the updated entry to the database
  //     await existingContestEntry.save();

  //     // Respond with a success message
  //     res.status(200).json({
  //       message: "Contest entry updated successfully",
  //       data: existingContestEntry,
  //     });

  //     console.log("existingContestEntry", existingContestEntry);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Error updating contest entry" });
  //     console.log("error", error);
  //   }
  // },
  async updateContestEntry(req, res) {
    const contestId = req.params.id;

    try {
      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      };

      // Extract contest data from the request body
      const {
        contestRules,
        awarenessData,
        termsAndConditions,
        contestResultDate,
        contestTitle,
        couponAmt,
        conteastPrize,
      } = req.body;

      // Check if contestId is provided
      if (!contestId) {
        return res
          .status(400)
          .json({ message: "Contest ID is required for updating" });
      }

      // Find the contest entry by ID
      const existingContestEntry = await ContestModel.findById(contestId);

      // Check if the contest entry exists
      if (!existingContestEntry) {
        return res.status(404).json({ message: "Contest entry not found" });
      }

      // Update only the provided fields
      if (contestRules) {
        existingContestEntry.contestRules = contestRules;
      }
      if (termsAndConditions) {
        existingContestEntry.termsAndConditions = termsAndConditions;
      }
      if (contestResultDate) {
        // existingContestEntry.contestResultDate = contestResultDate;
        const dateArray = contestResultDate.split("/");
        const formattedDate = new Date(
          `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
        );
        existingContestEntry.contestResultDate = formatDate(formattedDate);
      }

      if (awarenessData) {
        existingContestEntry.awarenessData = awarenessData;
      }
      if (contestTitle) {
        existingContestEntry.contestTitle = contestTitle;
      }
      if (couponAmt) {
        existingContestEntry.couponAmt = couponAmt;
      }
      if (conteastPrize) {
        existingContestEntry.conteastPrize = conteastPrize;
      }

      // Save the updated entry to the database
      await existingContestEntry.save();

      // Respond with a success message
      res.status(200).json({
        message: "Contest entry updated successfully",
        data: existingContestEntry,
      });

      console.log("existingContestEntry", existingContestEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating contest entry" });
      console.log("error", error);
    }
  },
  async fetchAllContestEntry(req, res) {
    try {
      const contests = await ContestModel.find({});
      res.status(200).json({ message: "Metada list fetched", data: contests });
    } catch (error) {
      res.status(500).json({ error: "Metada not list fetched" });
    }
  },
};

module.exports = metaCtrl;
