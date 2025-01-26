const UserModel = require("../models/superadmin.model");
const { encrypt } = require("../helpers/encrypt");

const userCtrl = {
  createUser(req, res) {
    let data = [req.body];

    if (Array.isArray(req.body)) data = req.body;

    console.log("req.file", req.file);
    console.log("req.body", req.body);

    //  code for encrypt password
    if (Array.isArray(data)) {
      data = data?.map((user) => {
        if (user?.password) {
          return {
            ...user,
            password: encrypt(user?.password),
          };
        }
        return user;
      });
    }

    // database

    UserModel.insertMany(data)
      .then((result) => {
        // user inserted  here
        res.status(201).send({ message: "User created", data: result });
      })
      .catch((err) => {
        res.status(500).send({ message: "User not created", error: err });
      });
  }, // created user

  updateUser(req, res) {
    const { id } = req.params;
    const user = req.body;

    //encrypt password code here

    if (user?.password) {
      user.password = encrypt(user?.password);
    }

    if (req?.file) {
      user.avatar = `avatars/${req.file?.filename}`;
    }

    UserModel.updateOne({ _id: id }, user, { new: true })
      .then((result) => {
        //user updated

        res.status(200).send({ message: "user updated", data: result });
      })
      .catch((err) => {
        console.log("User update:", err);
        res.status(404).send({ message: "user not updated", error: err });
      });
  }, //update user

  deleteUser(req, res) {
    const { id } = req.params;

    UserModel.deleteOne({ _id: id })
      .then((result) => {
        //user deleted

        res.status(200).send({ message: "user deleted", data: result });
      })
      .catch((err) => {
        console.log(err);
        //user not deleted
        res.status(404).send({ message: "user not deleted", error: err });
      });
  }, //delete user

  fetchOneUser(req, res) {
    const { id } = req.params;

    UserModel.findOne({ _id: id })
      .then((result) => {
        res.status(200).send({ message: "user fetched", data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "user not fetched", error: err });
      });
  }, //fetch one User

  fetchAllUser(req, res) {
    // const { id } = req.query;

    // UserModel
    //   .find({ id })
    //   .then((result) => {
    //     res.status(201).send({ message: "user list fetched", data: result });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).send({ message: "users not available", error: err });
    //   });

    const { status } = req.query;

    const filter = {
      $or: [{ status: 0 }, { status: 1 }],
    };

    if (status) filter.status = status;

    UserModel.find(filter)
      .then((result) => {
        if (!result) throw new Error("User not avilable");
        res.status(200).send({ message: "user list fetched", data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ message: "users not available", error: err });
      });
  }, //fetch all User
};

module.exports = userCtrl;
