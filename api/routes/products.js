const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsControler = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image.png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductsControler.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsControler.products_create_products);

router.get('/:productId', ProductsControler.products_get_product);

router.patch('/:productId', checkAuth, ProductsControler.products_update_product);

router.delete('/:productId', checkAuth, ProductsControler.products_delete_product);

module.exports = router;