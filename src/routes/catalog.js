var express = require('express');
var router = express.Router();

const multipleUpload = require('../middleware/multipleUpload')

const { getAllCatalog, AddData, updateData, GetDataById, DeleteData } = require("../controllers/catalog.controller");

router.get('/', getAllCatalog)
router.post('/', multipleUpload, AddData)
router.put('/:id', multipleUpload, updateData)
router.get('/:id', GetDataById)
router.delete('/:id', DeleteData)
// router.get('/:id', getCompanyById)
// router.post('/bulkcreate', uploadFile, bulkcreateCompany)

module.exports = router;
