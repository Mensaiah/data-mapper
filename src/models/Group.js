module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }
    },
    {
      timestamps: false
    }
  );
  Group.associate = function({ FieldData }) {
    Group.hasMany(FieldData, {
      foreignKey: 'groupId',
      as: 'group'
    });
  };
  return Group;
};
