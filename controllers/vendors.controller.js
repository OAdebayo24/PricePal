const { vendors } = require("../models");

function isValidPhoneNumber(phone) {
  return /^[0-9+\-\s()]{7,15}$/.test(phone);
}

module.exports = {
  async createVendor(req, res) {
    try {
      const { location, phone_number, business_name } = req.body;

      if (
        !location ||
        typeof location !== "string" ||
        location.trim().length < 2
      ) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid or missing location." });
      }

      if (!phone_number || !isValidPhoneNumber(phone_number)) {
        return res
          .status(400)
          .json({
            status: "fail",
            message: "Invalid or missing phone number.",
          });
      }

      if (
        !business_name ||
        typeof business_name !== "string" ||
        business_name.trim().length < 2
      ) {
        return res
          .status(400)
          .json({
            status: "fail",
            message: "Invalid or missing business name.",
          });
      }

      const Vendor = await vendors.create({
        location,
        phone_number,
        business_name,
      });
      return res.status(201).json({ status: "success", data: Vendor });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  async getAllVendors(req, res) {
    try {
      const Vendor = await vendors.findAll();
      return res
        .status(200)
        .json({ status: "success", results: vendors.length, data: Vendor });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  async getVendorById(req, res) {
    try {
      const Vendor = await vendors.findByPk(req.params.id);
      if (!Vendor) {
        return res
          .status(404)
          .json({ status: "fail", message: "Vendor not found" });
      }

      return res.status(200).json({ status: "success", data: Vendor });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  async updateVendor(req, res) {
    try {
      const { location, phone_number, business_name } = req.body;

      if (
        location &&
        (typeof location !== "string" || location.trim().length < 2)
      ) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid location." });
      }

      if (phone_number && !isValidPhoneNumber(phone_number)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid phone number." });
      }

      if (
        business_name &&
        (typeof business_name !== "string" || business_name.trim().length < 2)
      ) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid business name." });
      }

      const vendor = await vendors.findByPk(req.params.id);
      if (!vendor) {
        return res
          .status(404)
          .json({ status: "fail", message: "Vendor not found" });
      }

      await vendors.update({ location, phone_number, business_name });
      return res.status(200).json({ status: "success", data: vendor });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  async deleteVendor(req, res) {
    try {
      const Vendor = await vendors.findByPk(req.params.id);
      if (!Vendor) {
        return res
          .status(404)
          .json({ status: "fail", message: "Vendor not found" });
      }

      await vendors.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
};
