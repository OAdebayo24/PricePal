const bcryptjs = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const UserModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email_address: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      forgot_password_otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp_expire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // role: {
      //   type: DataTypes.ENUM("User", "Admin"),
      //   allowNull: false,
      // },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );
  UserModel.beforeCreate(async (user) => {
    user.password = await bcryptjs.hash(user.password, 10);
  });

  UserModel.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcryptjs.hash(user.password, 10);
    }
  });

  UserModel.prototype.validatePassword = function (inputPassword) {
    return bcryptjs.compare(inputPassword, this.password);
  };

  return UserModel;
}





