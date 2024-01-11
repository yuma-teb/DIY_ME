/* eslint-disable no-multi-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
const CatchError = require('../middleware/CatchError');
const Cart = require('../models/Cart');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = {
  // add CartItem by User
  addProductToCart: CatchError(async (req, res, next) => {
    try {
      const { user, cartItems } = req.body;
      let cart = await Cart.findOne({ user });
      if (!cart) {
        cart = new Cart({ user, cartItems: [] });
      }
      for (const item of cartItems) {
        // Check if each item has product and quantity and Variation
        if (!item.product || !item.quantity || !item.variations) {
          throw new ErrorHandler(400, 'productId and quantity are required');
        }

        // Check if the product is already in the cartItems
        const existingVariation = cart.cartItems.findIndex(
          (existItem) =>
            existItem.product.toString() === item.product.toString() &&
            existItem.variationIndex === item.variationIndex,
        );

        if (existingVariation !== -1) {
          // if the product already exist let it update the quantity
          const updateQty = (cart.cartItems[existingVariation].quantity += item.quantity);
          const { stock } = item.variations || 0;
          if (updateQty > stock) {
            throw new ErrorHandler(400, 'Quantity exceeds available stock');
          }
          cart.cartItems[existingVariation].quantity = updateQty;
        } else {
          // Check if the initial quantity exceeds the available stock
          const stock = item.variations.stock || 0;

          if (item.quantity > stock) {
            throw new ErrorHandler(400, 'Quantity exceeds available stock');
          }

          // Add the product to cartItems
          cart.cartItems.push({
            product: item.product,
            quantity: item.quantity,
            variations: item.variations,
            variationIndex: item.variationIndex,
          });
        }
      }

      await cart.save();

      res.status(201).json({
        status: 'success',
        data: cart,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }),

  // get Cart Items
  getCartByUser: CatchError(async (req, res, next) => {
    try {
      const user = req.params.userId;
      const cart = await Cart.findOne({ user });

      if (cart) {
        res.status(200).json({
          status: 'success',
          data: cart,
        });
      } else {
        res.status(404).json({
          status: 'fail',
          message: `user doesn't have cartItems`,
        });
      }
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }),

  updateQuantityItem: CatchError(async (req, res, next) => {
    try {
      const { quantity } = req.body;
      console.log(quantity);
      const cart = await Cart.findOne({ user: req.body.user });
      if (!cart) {
        throw new ErrorHandler(404, 'No cart founded in this user');
      }
      console.log(cart);

      const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId,
      );

      if (itemIndex !== -1) {
        const cartItem = cart.cartItems[itemIndex];
        if (quantity <= cartItem.variations.stock) {
          cartItem.quantity = quantity;
          cart.cartItems[itemIndex] = cartItem;
        } else {
          return next(new ErrorHandler('Stock is unavalible'));
        }
      } else {
        return next(new ErrorHandler('There is no item for this id', 404));
      }

      await cart.save();
      console.log(cart);

      res.status(200).json({
        status: 'success',
        data: cart,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }),

  removeItemFromCart: CatchError(async (req, res, next) => {
    try {
      const cart = await Cart.findOneAndUpdate({ user: req.body.user });

      const removeItemByCartItemId = cart.cartItems.pull({ _id: req.params.itemId });

      await cart.save();

      res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: removeItemByCartItemId,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
  }),
};
