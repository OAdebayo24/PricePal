const express = require("express");
const RegisterStoreRouter = express.Router();
const {
  createStore,
  updateStore,
  deleteStore,
  getAllStores,
  getStoreById,
} = require("../controllers/registerStores.controller");
const VendorAuth = require("../middlewares/verifyVendor.middleware");

RegisterStoreRouter.post("/register", VendorAuth, createStore);
RegisterStoreRouter.get("/", getAllStores);
RegisterStoreRouter.get("/:id", getStoreById);
RegisterStoreRouter.put("/:id", VendorAuth, updateStore);
RegisterStoreRouter.delete("/:id", VendorAuth, deleteStore);

module.exports = RegisterStoreRouter;
