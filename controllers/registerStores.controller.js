const { registerStore } = require("../models");

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);

const createStore = async (req, res) => {
  try {
    const {
      name,
      business_name,
      business_type,
      email,
      vendor_id,
      business_address,
      phone_number,
      business_reg_number,
      open_time,
      close_time,
    } = req.body;

    // Basic validations
    const requiredFields = {
      name,
      business_name,
      business_type,
      email,
      vendor_id,
      business_address,
      business_reg_number,
      open_time,
      close_time,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (phone_number && !isValidPhone(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    if (open_time >= close_time) {
      return res.status(400).json({
        success: false,
        message: "Open time must be before close time",
      });
    }

    // Check uniqueness
    const existingEmail = await registerStore.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "A store with this email already exists",
      });
    }

    if (phone_number) {
      const existingPhone = await registerStore.findOne({
        where: { phone_number },
      });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "A store with this phone number already exists",
        });
      }
    }

    const store = await registerStore.create({
      name,
      business_name,
      business_type,
      email,
      vendor_id,
      business_address,
      phone_number,
      business_reg_number,
      open_time,
      close_time,
    });

    return res.status(201).json({
      success: true,
      message: "Store registered successfully",
      data: store,
    });
  } catch (err) {
    console.error("Register Store Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
