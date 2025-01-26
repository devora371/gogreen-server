const AgentModel = require("../models/agent.model");
const { encrypt } = require("../helpers/encrypt");
const { generateRandomPassword } = require("../helpers/password");
const { decrypt } = require("../helpers/decrypt");

const agentCtrl = {
  // create 100 agent only

  // async createAgent(req, res) {
  //   try {
  //     // Check the current count of agents in the database
  //     const agentCount = await AgentModel.countDocuments();
  //     console.log("agentCount", agentCount);

  //     // If the count is less than 100, proceed to create a new agent
  //     if (agentCount < 10) {
  //       const { agentName, mobile, email, role, status } = req.body;

  //       // Pass agentName and length to generateRandomPassword
  //       const password = generateRandomPassword(agentName, 12);

  //       const agent = new AgentModel({
  //         agentName,
  //         password,
  //         mobile,
  //         email,
  //         role,
  //         status,
  //       });

  //       const savedAgent = await agent.save();

  //       res.status(201).json({ message: "Agent created", data: savedAgent });
  //     } else {
  //       // If the count is already 100 or more, respond with an error message
  //       res
  //         .status(400)
  //         .json({ message: `Cannot create more than ${agentCount} agents` });
  //     }
  //   } catch (error) {
  //     console.error("Error creating agent:", error);
  //     res
  //       .status(500)
  //       .json({ message: "Agent not created", error: error.message });
  //   }
  // },

  // create agent only

  async createAgent(req, res) {
    try {
      const { agentName, mobile, email, role, status } = req.body;

      // Pass agentName and length to generateRandomPassword
      const password = generateRandomPassword(agentName, 12);

      const agent = new AgentModel({
        agentName,
        password,
        mobile,
        email,
        role,
        status,
      });

      const savedAgent = await agent.save();

      res.status(201).json({ message: "Agent created", data: savedAgent });
    } catch (error) {
      console.error("Error creating agent:", error);
      res
        .status(500)
        .json({ message: "Agent not created", error: error.message });
    }
  },

  updateAgent(req, res) {
    const { id } = req.params;
    const agent = req.body;

    AgentModel.updateOne({ _id: id }, agent, { new: true })
      .then((result) => {
        res.status(200).send({ message: "Agent updated", data: result });
      })
      .catch((err) => {
        console.log("Agent update:", err);
        res.status(404).send({ message: "Agent not updated", error: err });
      });
  }, // update agent

  deleteAgent(req, res) {
    const { id } = req.params;

    AgentModel.deleteOne({ _id: id })
      .then((result) => {
        res.status(200).send({ message: "Agent deleted", data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "Agent not deleted", error: err });
      });
  }, // delete agent

  fetchOneAgent(req, res) {
    const { id } = req.params;

    AgentModel.findOne({ _id: id })
      .then((result) => {
        // Decrypt the password before sending it in the response
        if (result) {
          result.password = decrypt(result.password);
        }

        res.status(200).send({ message: "Agent fetched", data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "Agent not fetched", error: err });
      });
  }, //fetch one agent
  fetchAllAgent(req, res) {
    AgentModel.find()
      .sort({ createdAt: -1 })

      .then((agents) => {
        // Decrypt passwords before sending the response
        const agentsWithDecryptedPasswords = agents.map((agent) => {
          return {
            ...agent.toObject(),
            // password: decrypt(agent.password),
            password: agent.password,
          };
        });

        res.status(200).send({
          message: "Agent list fetched",
          data: agentsWithDecryptedPasswords,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "Agents not available", error: err });
      });
  }, // fetch all agents
};

module.exports = agentCtrl;
