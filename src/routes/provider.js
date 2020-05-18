const express = require('express');
const { check } = require('express-validator');
const ProviderController = require('../controller/provider');
const router = express.Router();

router.post(
  '/create-spec',
  [
    check('providerId', 'Provider Id is Required')
      .not()
      .isEmpty(),
    check('providerId', 'Provider Id must be an integer').isNumeric(),
    check('fields', 'Fields is required')
      .not()
      .isEmpty(),
    check('fields', 'Fields should be an array').isArray()
  ],
  ProviderController.createDataSpecification
);

router.post(
  '/load-data',
  check('providerId', 'Provider Id is Required')
    .not()
    .isEmpty(),
  check('providerId', 'Provider Id must be an integer').isNumeric(),
  check('data', 'Data is required')
    .not()
    .isEmpty(),
  check('data', 'Data should be an array').isArray(),
  ProviderController.loadData
);

router.get('/get-data/:providerId', ProviderController.getData);

module.exports = router;
