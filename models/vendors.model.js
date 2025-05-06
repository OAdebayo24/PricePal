
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id"
        }
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

  VendorModel.associate = (models) => {
    VendorModel.belongsTo(models.users, { foreignKey: "user_id" });
  };

  return VendorModel;
};
