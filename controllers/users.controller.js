const { users, vendors } = require("../models");
const { Op } = require("sequelize");
const ratingController = require("./rating.controller");

// Get all users with filtering, pagination, and sorting
// function formatRole(role) {
//   return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
// }

// const VALID_ROLES = ["Admin", "User"];

async function getAllUsers(req, res, next) {
  try {
    const {
      cursor,
      user_id = "",
      email_address = "",
      role = "",
      sort = "createdAt",
      order = "DESC",
      ...invalidKeys
    } = req.query;

    if (Object.keys(invalidKeys).length > 0) {
      return res.status(400).json({
        message: "Invalid search key(s) provided",
        invalidKeys: Object.keys(invalidKeys),
      });
    }

    let whereCondition = {};

    // Filtering conditions
    if (user_id) whereCondition.id = { [Op.eq]: user_id };
    if (email_address)
      whereCondition.email_address = { [Op.iLike]: `%${email_address}%` };

    // if (role) {
    //   const formattedRole = formatRole(role);

    //   if (!VALID_ROLES.includes(formattedRole)) {
    //     return res.status(400).json({
    //       message: `Invalid role provided. Allowed values: ${VALID_ROLES.join(
    //         ", "
    //       )}`,
    //     });
    //   }

    //   whereCondition.role = formattedRole;
    // }

    // Cursor-based pagination (only if id filter isn't used)
    if (cursor && !user_id) {
      whereCondition.user_id = { [Op.gt]: cursor };
    }

    // Validate sorting fields
    const validSortFields = ["createdAt", "updatedAt"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    // Fetch users with owner details
    const userList = await users.findAll({
      where: whereCondition,
      order: [[sortField, sortOrder]],
      limit: 20,
      include: [
        {
          model: vendors,
          required: false,
        },
      ],
    });

    if (userList.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Fetch ratings for each user
    // const usersWithRatings = await Promise.all(
    //   userList.map(async (user) => {
    //     const ratingDetails = await ratingController.getUsersRating(user.id);

    //     return {
    //       user_id: user.id,
    //       last_name: user.last_name,
    //       role: user.role,
    //       vendors: user.vendor
    //         ? {
    //             verification_status: user.vendors.verification_status,
    //           }
    //         : null,
    //       ratings: ratingDetails,
    //       createdAt: user.createdAt,
    //       updatedAt: user.updatedAt,
    //     };
    //   })
    // );

    return res.status(200).json({ users: usersWithRatings });
  } catch (err) {
    console.error("Error fetching users:", err);
    next(err);
  }
}

// Function to update vendor verification status
// async function updateVendorStatus(req, res, next) {
//   try {
//     const { id } = req.params;
//     let { verification_status } = req.body;

//     // console.log(id);

//     // Convert verification_status to lowercase and compare
//     if (verification_status.toLowerCase() !== "verified") {
//       return res.status(400).json({
//         message:
//           "Invalid verification status. Status can only be updated to 'Verified'.",
//       });
//     }

//     const vendor = await vendors.findOne({
//       where: { user_id: id },
//     });

//     if (!vendor) {
//       return res.status(404).json({ message: "vendor details not found." });
//     }

//     if (vendor.verification_status.toLowerCase() === "verified") {
//       return res.status(400).json({ message: "vendor is already verified." });
//     }

//     // Update the verification status
//     vendor.verification_status = "Verified";
//     await vendor.save();

//     return res.status(200).json({
//       message: "vendor verified successfully.",
//       vendor,
//     });
//   } catch (error) {
//     console.error("Error updating owner state:", error);
//     next(error);
//   }
// }

// Update user details
// async function editUserDetails(req, res, next) {
//   try {
//     const { id } = req.params;

//     // Define valid user and vendor fields separately
//     const allowedUserFields = ["email_address"];
//     const allowedVendorFields = ["location", "phone_number", "business_name"];

//     const updates = Object.keys(req.body);

//     const userUpdates = {};
//     const vendorUpdates = {};

//     // Separate valid fields into user and vendor updates
//     updates.forEach((field) => {
//       if (allowedUserFields.includes(field)) {
//         userUpdates[field] = req.body[field];
//       } else if (allowedVendorFields.includes(field)) {
//         vendorUpdates[field] = req.body[field];
//       }
//     });

//     if (
//       Object.keys(userUpdates).length === 0 &&
//       Object.keys(vendorUpdates).length === 0
//     ) {
//       return res.status(400).json({ message: "No valid fields to update." });
//     }

//     // Find user with vendor details
//     const user = await users.findByPk(id, {
//       include: [
//         {
//           model: vendors,
//           attributes: ["location", "phone_number", "business_name"],
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update user fields
//     if (Object.keys(userUpdates).length > 0) {
//       await user.update(userUpdates);
//     }

//     // Update or create Vendor record
//     if (Object.keys(vendorUpdates).length > 0) {
//       if (user.Vendor) {
//         await user.Vendor.update(vendorUpdates);
//       } else {
//         await vendors.create({
//           user_id: user.id,
//           ...vendorUpdates,
//         });
//       }
//     }

//     return res.status(200).json({
//       message: "User details updated successfully.",
//       user: {
//         id: user.id,
//         email_address: user.email_address,
//         role: user.role,
//         vendorDetails: user.Vendor || vendorUpdates,
//         createdAt: user.createdAt,
//         updatedAt: new Date(), // Reflect updated time
//       },
//     });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     next(err);
//   }
// }


// // Delete user
// async function deleteUser(req, res, next) {
//   try {
//     const { id } = req.params;
//     const user = await users.findByPk(id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Prevent deletion if the user is an admin
//     if (user.role.toLowerCase() === "admin") {
//       return res
//         .status(403)
//         .json({ message: "Admin users cannot be deleted." });
//     }
//     await user.destroy();

//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     next(err);
//   }
// }

module.exports = {
  getAllUsers,
  // updateVendorStatus,
  // editUserDetails,
  // deleteUser,
};
