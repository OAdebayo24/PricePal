module.exports = (sequelize, DataTypes) => {
  const RegStoreModel = sequelize.define(
    "RegisterStore",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      business_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      business_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Vendors",
          key: "id",
        },
      },
      business_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },
      business_reg_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      open_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      close_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "RegisterStores",
      timestamps: true,
      validate : {
        openBeforeClose() {
          if(this.open_time >= this.close_time) {
            throw new Error("Open time must be before close time")
          }
      }}
    }
  );
  return RegStoreModel;
}