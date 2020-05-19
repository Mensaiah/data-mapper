const { validationResult } = require('express-validator');
const { Provider, Field, Group, FieldData, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const { checkLogic } = require('../helpers/fieldValidator');
const {
  isNumber,
  isString,
  isDate,
  isObjEmpty
} = require('../helpers/fieldValidator');

module.exports = {
  createDataSpecification: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { providerId, fields } = req.body;
      //

      // check for existing Provider
      const existingProvider = await Provider.findOne({
        where: {
          id: providerId
        }
      });
      if (existingProvider) {
        return res.status('401').json({ error: 'Provider Id already exists' });
      }

      //validate fields for duplicate
      const dupRemoved = new Set();
      fields.forEach(e => {
        dupRemoved.add(e);
      });

      if (dupRemoved.size !== fields.length) {
        res
          .status(400)
          .json({ message: 'Please Remove Duplicate From Fields' });
      }

      // Create Provider
      const provider = await Provider.create({
        id: providerId
      });

      let allFields = [];

      fields.forEach((element, index) => {
        allFields.push({
          name: element,
          providerId: provider.id
        });
      });

      // Add New Fields
      const newFields = await Field.bulkCreate(allFields, { returning: true });

      if (newFields) {
        return res.status(201).json({
          message: 'New Specification Added Successfully',
          dataAdded: req.body
        });
      }

      return res.status(400).json({ message: 'Unable to add Specification' });
    } catch (error) {
      res.status(500).json("Server Error don't worry we are fixing it");
    }
  },

  loadData: async (req, res) => {
    try {
      const { providerId, data } = req.body;

      // check for existing Provider
      const existingProvider = await Provider.findOne({
        where: {
          id: providerId
        }
      });

      if (!existingProvider) {
        return res
          .status('404')
          .json({ error: 'Provider with that Id does not exist' });
      }

      const fieldsInProvider = await Field.findAll({
        where: {
          providerId: existingProvider.id
        },
        attributes: ['id', 'name', 'providerId']
      });

      const fieldNameMapper = {};
      for (field of fieldsInProvider) {
        fieldNameMapper[field.name] = field.id;
      }

      let allFieldsData = [];

      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const group = await Group.create();
        for (let fieldName of Object.keys(element)) {
          const value = element[fieldName];
          if (isDate(value)) {
            allFieldsData.push({
              fieldId: fieldNameMapper[fieldName],
              timestamps: value,
              groupId: group.id
            });
          } else if (isString(value)) {
            allFieldsData.push({
              fieldId: fieldNameMapper[fieldName],
              string: value,
              groupId: group.id
            });
          } else if (isNumber(value)) {
            allFieldsData.push({
              fieldId: fieldNameMapper[fieldName],
              number: value,
              groupId: group.id
            });
          } else {
            return res.status(400).json({
              error: `You have inserted a wrong dataType for only string, numbers and timestamps are supported`
            });
          }
        }

        const fieldsData = await FieldData.bulkCreate(allFieldsData, {
          returning: true
        });

        if (fieldsData) {
          return res
            .status(201)
            .json({ message: 'Data Inserted', data: fieldsData });
        }
        return res.status(400).json({ message: 'Unable to Insert data' });
      }
    } catch (error) {
      res.status(500).json("Server Error don't worry we are fixing it");
    }
  },

  getData: async (req, res) => {
    try {
      const {
        params: { providerId },
        query
      } = req;

      let allFields;

      const addLogic = query => {
        let logic = '';
        const qKeys = Object.keys(query);
        if (qKeys.length === 0) {
          logic = '';
        }
        for (let item of qKeys) {
          let data = query[item].split(':');
          data = [data[0], data.slice(1).join(':')];
          console.log(data);

          const eqSign = checkLogic(data[0]);
          const value = data[1];
          // console.log(value, Number.isFinite(Number(value)));
          // console.log(eqSign === 'ILIKE' || Number.isFinite(Number(value)));

          const timeLogic =
            eqSign === 'ILIKE' || Number.isFinite(Number(value))
              ? ''
              : ` OR timestamps ${eqSign} '${value}'  `;

          const numLogic =
            eqSign === 'ILIKE' || !Number.isFinite(Number(value))
              ? ''
              : ` OR number ${eqSign} ${Number(value)}`;

          logic += `AND (name = '${item}' AND string ${eqSign} '${value}' 
      ${timeLogic}
      ${numLogic} 
          )
          `;
        }

        return logic;
      };

      allFields = await sequelize.query(
        `SELECT DISTINCT outerFd."groupId", "name" as "fieldName", "providerId", timestamps, number, string  
        FROM "FieldData"  as outerFd
        JOIN (
       
       SELECT  DISTINCT fd."groupId" 
            FROM "Fields" as f 
             JOIN "FieldData" as fd ON fd."fieldId" = f.id  
             WHERE (f."providerId" = ${providerId}) ${addLogic(query)}
        ) as subquery 
       ON subquery."groupId" = outerFd."groupId"
       
       JOIN "Fields" on
       "Fields".id = outerFd."fieldId"
       
       ORDER BY "groupId"
       ;`,
        {
          type: QueryTypes.SELECT
        }
      );

      if (allFields.length === 0) {
        return res.status(200).json([]);
      }

      const numOfGroups = allFields.slice(-1)[0].groupId;

      const alldata = {
        providerId: allFields[0].providerId,
        data: []
      };
      for (let i = 0; i < numOfGroups; i++) {
        const gData = {};
        allFields.forEach(data => {
          let mainData;
          if (data.groupId === i + 1) {
            if (data.number) {
              mainData = data.number;
            } else if (data.string) {
              mainData = data.string;
            } else {
              mainData = data.timestamps;
            }

            gData[data.fieldName] = mainData;
          }
        });
        alldata.data.push(gData);
      }
      return res.status(200).json(alldata);
    } catch (error) {
      res.status(500).json("Server Error don't worry we are fixing it");
    }
  }
};
