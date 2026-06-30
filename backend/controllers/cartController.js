import Cart from "../models/Cart.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    console.log("Request Body:", req.body);
    console.log("User ID:", userId);
    console.log("Product ID:", productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};