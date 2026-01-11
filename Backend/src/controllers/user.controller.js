import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndrefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(userId);
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating AccessToken or refreshToken"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get details of the user from the frontend
  // validation - not empty
  //check if user already exists:through username , or email
  //check for image, check for avatar
  //upload them to cloudinary, check for avatar here too
  //create user object - create entry in db
  // remove password and refresh token field from the response
  // check if user creation,, response get or not get
  // return res
  const { name, email, password, role } = req.body;

  console.log("email:", email);
  if ([email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with same name or mail already exists");
  }

  const user = await User.create({
    email,
    password,
    name: name.toLowerCase(),
    role,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email
  // find the user
  //password check
  //access and refresh token renegrate
  // send cookie

  const { email, name, password } = req.body;

  if (!(email || name)) {
    throw new ApiError(400, "Either email or username is  required ");
  }

  const user = await User.findOne({
    $or: [{ email }, { name }],
  });

  if (!user) {
    throw new ApiError(404, "User is not registered or found");
  }

  const validatePassword = await user.isPasswordCorrect(password);

  if (!validatePassword) {
    throw new ApiError(401, "wrong user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndrefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true, // allows only server to modify cookies
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        `${loggedInUser.role} logged in successfully`
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //req.user._id //.user created during jwtverify similar to req.body and req.cookie
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true, // allows only server to modify cookies
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, ` ${req.user.role} logged out successfully`)
    );
});

const getUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefeshToken = req.cookies.refreshToken || req.body.refreshToken; //req.body for mobile application
  if (!incomingRefeshToken) {
    throw new ApiError(
      401,
      "Invalid RefreshError during regenerating access token"
    );
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefeshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // console.log(decodedRefreshToken)
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "user not found while regenerating access token");
    }
    //console.log(user);
    // console.log(user?.refreshToken)
    if (incomingRefeshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    console.log("user validated for refresh token is ", user.name);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndrefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed succussfully"
        )
      );
  } catch (error) {
    console.log("error in refresh token is ", error);
    throw new ApiError(401, error?.message || "Invaild access token 222");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "USER" }).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const updateAccount = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "name and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email: email,
        name: name.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User account updated successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name?.trim()) {
    throw new ApiError(400, "name is missing");
  }

  const user = await User.findOne({ name: name.toLowerCase() }).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user channel fetched successfully"));
});

// Cart Functionality

const addProductToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number") {
    throw new ApiError(400, "Quantity must be a number not string");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingCartItemIndex = user.cart.findIndex(
    (item) => item.item.toString() === productId
  );

  if (existingCartItemIndex > -1) {
    if (product.stock < quantity + user.cart[existingCartItemIndex].quantity) {
      throw new ApiError(400, `Only ${product.stock} items left in stock`);
    }
    user.cart[existingCartItemIndex].quantity += quantity;
  } else {
    if (product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} items left in stock`);
    }
    user.cart.push({
      item: productId,
      quantity: quantity,
    });
  }

  const savedUser = await user.save();

  console.log("Saved user after adding to cart: ", savedUser);

  if (!savedUser) {
    throw new ApiError(500, "Failed to add product to cart");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Product added to cart successfully"));
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { cart: { item: productId } } },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.cart, "Product removed from cart successfully")
    );
});

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "cart.item",
    select: "name price stock productImage",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart items fetched successfully"));
});

const changeQuantityInCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cartItemIndex = user.cart.findIndex(
    (item) => item.item.toString() === productId
  );

  if (cartItemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} items left in stock`);
  }

  user.cart[cartItemIndex].quantity = quantity;

  const savedUser = await user.save();

  if (!savedUser) {
    throw new ApiError(500, "Failed to update cart quantity");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, savedUser.cart, "Cart quantity updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  refreshAccessToken,
  changePassword,
  getAllUser,
  updateAccount,
  getUserProfile,
  addProductToCart,
  removeProductFromCart,
  getCart,
  changeQuantityInCart
};
