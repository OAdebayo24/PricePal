const { vendors } = require("../models");

async function verifyVendor(req, res, next) {
  try {
    const vendorId = req.user?.id;

    if (!vendorId) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized access" });
    }

    const userData = await vendors.findOne({ where: { id: vendorId } }); // Sequelize query

    // if (!userData || userData.role.toLowerCase() !== "vendor") {
    //   return res.status(403).json({
    //     status: 403,
    //     message: "Only vendors are authorized to access this resource.",
    //   });
    // }
    
    if (!userData ) {
      return res.status(403).json({
        status: 403,
        message: "Only vendors are authorized to access this resource.",
      });
    }

    next();
  } catch (err) {
    console.error("Error verifying vendor:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}

module.exports = verifyVendor;
