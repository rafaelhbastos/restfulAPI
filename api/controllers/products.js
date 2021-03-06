const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
      .select('name price _id productImage')
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              productImage: doc.productImage,
              price: doc.price,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://127.0.0.1:3000/products/' + doc._id
              }
            }
          })
        }
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };

  exports.products_create_products = (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    })
    product.save().then(result => {
      res.status(201).json({
        message: 'Created product successfuly',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://127.0.0.1:3000/products/' + result._id
          }
        }
      });
    })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
            peoduct: doc,
            request: {
              type: 'GET',
              url: 'http://127.0.0.1:3000/products'
            }
          });
        } else {
          res.status(404).json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  
  };

  exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(() => {
        res.status(200).json({
          message: 'Product updated',
          request: {
            type: 'GET',
            url: 'http://127.0.0.1:3000/products/' + id
          }
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  };

  exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(() => {
        res.status(200).json({
          messaage: 'Product deleted',
          request: {
            type: 'POST',
            url: 'http://127.0.0.1:3000/products',
            body: { name: 'String', price: 'Number' }
          }
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  };