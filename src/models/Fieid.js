module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define(
    'Field',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      providerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Provider',
          key: 'id'
        }
      }
    },
    {
      timestamps: false
    }
  );
  Field.associate = function({ Provider, FieldData }) {
    Field.hasMany(FieldData, {
      foreignKey: 'fieldId'
    });
    Field.belongsTo(Provider, {
      foreignKey: 'providerId',

      onDelete: 'CASCADE'
    });
  };
  return Field;
};
