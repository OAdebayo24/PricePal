const express = require("express");
const UserController = require("../controllers/users.controller");
const UserRouter = express.Router();

UserRouter.get("/", UserController.getAllUsers);
// UserRouter.put("/verify/:id", UserController.updateVendorStatus);
// UserRouter.put("/edit/:id", UserController.editUserDetails);
// UserRouter.delete("/:id", UserController.deleteUser);

module.exports = UserRouter;
