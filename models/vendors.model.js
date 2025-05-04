
module.exports = (sequelize, DataTypes) => {
  const VendorModel = sequelize.define(
    "Vendor",
    {   
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      business_name: {
        type: DataTypes.STRING,
        allowNull: false
      }, // optional
    },
    {
      tableName: "Vendors",
      timestamps: true,
    }
  );

  // vendors.associate = (models) => {
  //   vendors.belongsTo(models.User, { foreignKey: "user_id" });
  // };

  return VendorModel;
};
