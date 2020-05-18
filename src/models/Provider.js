module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define(
    'Provider',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    },
    {
      timestamps: false
    }
  );
  Provider.associate = function({ Field }) {
    Provider.hasMany(Field, {
      foreignkey: 'providerId',
      as: 'provider'
    });
  };
  return Provider;
};
