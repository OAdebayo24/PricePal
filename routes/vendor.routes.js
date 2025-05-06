// routes/vendorRoutes.js
const express = require("express");
const VendorRouter = express.Router();
const VendorController = require("../controllers/vendors.controller");
const vendorAuth = require("../middlewares/verifyUser.middleware");


VendorRouter.post("/", vendorAuth, VendorController.createVendor);
VendorRouter.get("/", VendorController.getAllVendors);
VendorRouter.get("/:id", VendorController.getVendorById);
VendorRouter.put("/:id", vendorAuth, VendorController.updateVendor);
VendorRouter.delete("/:id", vendorAuth, VendorController.deleteVendor);

module.exports = VendorRouter;
