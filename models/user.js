var crypto    = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var UserAccount = sequelize.define("User", {
    // Do not need to define created_at, edited_at, deleted_at or id
    username: { type: DataTypes.TEXT, allowNull: false },
    salt: { type: DataTypes.TEXT, allowNull: false },
    hashedPassword: { type: DataTypes.TEXT, allowNull: false, field: 'hashed_password' },
    roles: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false }
  }, {
    // Adds createdAt and updatedAt timestamps to the model.
    timestamps: true,

    // Calling destroy will not delete the model, but instead set a deletedAt timestamp
    // if this is true. Needs timestamps=true to work.
    paranoid: true,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'user_account',
    classMethods: {
      createSalt: function() {
        return crypto.randomBytes(128).toString('base64');
      },
      hashPassword: function(salt, pwd) {
        var hmac = crypto.createHmac('sha1', salt);
        return hmac.update(pwd).digest('hex');
      }
    },
    instanceMethods: {
      authenticate: function(passwordToMatch) {
        return UserAccount.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
      },
      clean: function() {
        delete this.dataValues.salt;
        delete this.dataValues.hashed_password;
        delete this.dataValues.created_at;
        delete this.dataValues.updated_at;
        delete this.dataValues.deleted_at;
      }
    }
  });
  return UserAccount;
};