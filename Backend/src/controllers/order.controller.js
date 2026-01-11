import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createOrder = asyncHandler( async (req,res) => {

    const { address } = req.body;

    if(!address){
        throw new ApiError(400, "Address is required to create an order")
    }
    
    const cart = req.user.cart;


    if(!cart || cart.length === 0){
        throw new ApiError(400, "Cart is empty. Cannot create order")
    }

    await req.user.populate('cart.item');

    let orderPrice = 0;

    const orderItems = cart.map((cartItem) => {
        const price = cartItem.item.price; // item is populated Product
        const quantity = cartItem.quantity;

        orderPrice += price * quantity;

        return {
            product: cartItem.item._id,
            quantity,
            priceAtPurchase: price
        };
    });

    const order = await Order.create({
        customer: req.user._id,
        orderItems: orderItems,
        orderPrice: orderPrice,
        address,
    });

    const createdOrder = await Order.findById(order._id).populate({
        path : 'customer',
        select : 'name email'
    }).populate({
        path : 'orderItems.product',
        select : 'name price stock'
    });

    if(!createdOrder){
        throw new ApiError(500, "Something went wrong while creating the order")
    }


    // clear user cart after order creation
    req.user.cart = [];
    await req.user.save();      

    // reduce the stock quantity of products
    for(const orderItem of createdOrder.orderItems){
        const product = await Product.findById(orderItem.product);
        product.stock -= orderItem.quantity;
        await product.save();
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdOrder, "Order created successfully")
    )  
});

const buyNow = asyncHandler( async (req,res) => {
    const { productId } = req.params;
    const { quantity, address } = req.body;     

    if(!address){
        throw new ApiError(400, "Address is required to create an order")
    }

    if( !productId || !quantity || quantity <= 0 || !Number.isInteger(quantity) ){
        throw new ApiError(400, "Product ID and valid quantity are required")
    }

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found")
    }

    if(product.stock < quantity){
        throw new ApiError(400, `Only ${product.stock} items left in stock`)
    }

    const orderPrice = product.price * quantity;

    const orderItem = {
        product: product._id,
        quantity,
        priceAtPurchase: product.price
    }; 

    const order = await Order.create({
        customer: req.user._id,
        orderItems: [orderItem],
        orderPrice: orderPrice,
        address,
    });

    const createdOrder = await Order.findById(order._id).populate({
        path : 'customer',
        select : 'name email'
    }).populate({
        path : 'orderItems.product',
        select : 'name price stock'
    });

    if(!createdOrder){
        throw new ApiError(500, "Something went wrong while creating the order")
    }

    // reduce the stock quantity of product
    product.stock -= quantity;

    await product.save();

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdOrder, "Order created successfully")
    )  
});

const getUserOrders = asyncHandler( async (req,res) => {
    const orders = await Order.find({ customer: req.user._id }).populate({
        path: 'orderItems.product',
        select: 'name price stock description productImage'
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    )  
});

// for admin only
const getAllUserOrders = asyncHandler( async (req,res) => {
    const orders = await Order.find()
      .populate({
        path: "orderItems.product",
        select: "name price stock",
      })
      .populate({
        path: "customer",
        select: "name email",
      });
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, orders, "All user orders fetched successfully")
      );  
});

const getUserOrdersById = asyncHandler( async (req,res) => {
    const { userId } = req.params;
    const orders = await Order.find({ customer: userId }).populate({
        path: 'orderItems.product',
        select: 'name price stock description productImage'
    });
    return res
    .status(200)
    .json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    )  
});

// const onDelivery = asyncHandler( async (req,res) => {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId);

//     if(!order){
//         throw new ApiError(404, "Order not found");
//     } 
//     order.status = 'DELIVERED';
//     await order.save();

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, order, "Order status updated to DELIVERED")
//     )  
// });

// const cancelOrder = asyncHandler( async (req,res) => {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId);

//     if(!order){
//         throw new ApiError(404, "Order not found");
//     }

//     order.status = 'CANCELLED';
//     await order.save();

//     // update the stock quantity of products
//     for(const orderItem of order.orderItems){
//         const product = await Product.findById(orderItem.product);
//         product.stock += orderItem.quantity;
//         await product.save();
//     }

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, order, "Order status updated to CANCELLED")
//     )  
// });

// // to change address, items in order etc 
// const updateOrder = asyncHandler( async (req,res) => {
//     const { orderId } = req.params;
//     const { address } = req.body;

//     const order = await Order.findById(orderId);

//     if(!order){
//         throw new ApiError(404, "Order not found");
//     }

//     order.address = address;
//     await order.save();

//     const updatedOrder = await Order.findById(orderId).populate({
//         path : 'customer',
//         select : 'name email'
//     });

//     if(!updatedOrder){  
//         throw new ApiError(500, "Something went wrong while updating the order")
//     }

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, order, "Order updated successfully")
//     )  
// });

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, address } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Update address if provided
  if (address !== undefined) {
    order.address = address;
  }

  // Handle status updates
  if (status !== undefined) {
    // Prevent invalid transitions if needed
    if (order.status === "CANCELLED") {
      throw new ApiError(400, "Cancelled order cannot be updated");
    }

    // If cancelling → restore product stock
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const orderItem of order.orderItems) {
        const product = await Product.findById(orderItem.product);

        if (product) {
          product.stock += orderItem.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
  }

  await order.save();

  const updatedOrder = await Order.findById(orderId).populate({
    path: "customer",
    select: "name email",
  });

  if (!updatedOrder) {
    throw new ApiError(500, "Something went wrong while updating the order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
});



export {
    createOrder,
    buyNow,
    getUserOrders,
    getAllUserOrders,
    getUserOrdersById,
    updateOrder 
}   