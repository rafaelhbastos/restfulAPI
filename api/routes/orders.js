const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersControler = require('../controllers/orders');

router.get('/', checkAuth, OrdersControler.orders_get_all);

router.post('/', checkAuth, OrdersControler.orders_create_order);

router.get('/:orderId', checkAuth, OrdersControler.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersControler.orders_delete_order);


module.exports = router;