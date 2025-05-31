const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart_controller');

router.post('/', cartController.createCart);

router.post('/:cartId/item', cartController.addItemToCart);

router.get('/:cartId', cartController.getCart);

router.put('/:cartId/item/:productId', cartController.updateCartItem);

router.delete('/:cartId/item/:productId', cartController.deleteCartItem);

router.delete('/:cartId', cartController.deleteCart);

module.exports = router;
