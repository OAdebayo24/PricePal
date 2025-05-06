const { registerStore } = require("../models");
const { vendors } = require("../models");


// const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
// const isValidPhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);

const createStore = async (req, res) => {
  try {
    const {
      name,
      business_name,
      business_type,
      email,
      business_address,
      phone_number,
      business_reg_number,
      open_time,
      close_time,
    } = req.body;

    const vendor = req.vendor;

    if (!vendor) {
      return res.status(403).json({ message: "Unauthorized vendor access." });
    }

    // Validate required fields
    const requiredFields = {
      name,
      business_name,
      business_type,
      email,
      business_address,
      business_reg_number,
      open_time,
      close_time,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== "string" || value.trim().length === 0) {
        return res
          .status(400)
          .json({ message: `Missing or invalid field: ${key}` });
      }
    }

    if (open_time >= close_time) {
      return res
        .status(400)
        .json({ message: "Open time must be before close time." });
    }

    // Prevent duplicate store registration for same vendor
    const existingStore = await registerStore.findOne({
      where: { vendor_id: vendor.id },
    });

    if (existingStore) {
      return res.status(400).json({
        message: "Vendor has already registered a store.",
      });
    }

    // Create store
    const newStore = await registerStore.create({
      name,
      business_name,
      business_type,
      email,
      vendor_id: vendor.id,
      business_address,
      phone_number,
      business_reg_number,
      open_time,
      close_time,
    });

    return res.status(201).json({
      message: "Store registered successfully.",
      store: newStore,
    });
  } catch (error) {
    console.error("Error creating store:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email or phone number already exists.",
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};



const updateStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const vendorId = req.vendor.id;

    const store = await registerStore.findOne({
      where: { id: storeId, vendor_id: vendorId },
    });

    if (!store) {
      return res
        .status(404)
        .json({ message: "Store not found or not owned by you" });
    }

    await store.update(req.body);

    return res
      .status(200)
      .json({ success: true, message: "Store updated", data: store });
  } catch (err) {
    console.error("Update Store Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const vendorId = req.vendor.id;

    const store = await registerStore.findOne({
      where: { id: storeId, vendor_id: vendorId },
    });

    if (!store) {
      return res
        .status(404)
        .json({ message: "Store not found or not owned by you" });
    }

    await store.destroy();

    return res.status(200).json({ success: true, message: "Store deleted" });
  } catch (err) {
    console.error("Delete Store Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllStores = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const stores = await registerStore.findAll({
      where: { vendor_id: vendorId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: stores,
    });
  } catch (err) {
    console.error("Get All Stores Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const storeId = req.params.id;

    const store = await registerStore.findOne({
      where: {
        id: storeId,
        vendor_id: vendorId,
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found or not owned by you",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: store,
    });
  } catch (err) {
    console.error("Get Store By ID Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
  getAllStores,
};
