const { vendors } = require("../models");

async function verifyVendor(req, res, next) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized access" });
    }

    const vendorData = await vendors.findOne({ where: { user_id: userId } }); // Sequelize query

    // if (!userData || userData.role.toLowerCase() !== "vendor") {
    //   return res.status(403).json({
    //     status: 403,
    //     message: "Only vendors are authorized to access this resource.",
    //   });
    // }
    
    if (!vendorData) {
      return res.status(403).json({
        status: 403,
        message: "Only vendors are authorized to access this resource.",
      });
    }

    req.vendor = vendorData

    next();
  } catch (err) {
    console.error("Error verifying vendor:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}

module.exports = verifyVendor;
