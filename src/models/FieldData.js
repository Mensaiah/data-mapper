module.exports = (sequelize, DataTypes) => {
  const FieldData = sequelize.define(
    'FieldData',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Field',
          key: 'id'
        }
      },
      timestamps: {
        type: DataTypes.DATE,
        allowNull: true
      },
      string: {
        type: DataTypes.STRING,
        allowNull: true
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Group',
          key: 'id'
        }
      }
    },
    {
      timestamps: false
    }
  );
  FieldData.associate = function({ Field, Group }) {
    FieldData.belongsTo(Field, {
      foreignKey: 'fieldId',

      onDelete: 'CASCADE'
    });

    FieldData.belongsTo(Group, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE'
    });
  };
  return FieldData;
};
