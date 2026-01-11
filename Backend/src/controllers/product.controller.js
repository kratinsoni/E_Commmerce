import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler( async (req,res) => {
    const { description, name, price, stock } = req.body;

    if( [ description, name, price, stock ].some( ( field ) => field === undefined || field === null ) ){
        throw new ApiError( 400, "All fields are required" );
    }   

    console.log( " Files received: ", req.file );  

    let productImageLocalPath = "";

    if (req.file) {
        productImageLocalPath = req.file.path;
    }
    // Upload to Cloudinary

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    if( !productImage || !productImage.secure_url ){
        throw new ApiError( 500, "Product image upload failed" );
    }   

    const product = await Product.create({
        owner: req.user._id,
        productImage: productImage.secure_url,
        description,
        name,
        price,
        stock
    })

    const createdProduct = await Product.findById(product._id)

    if(!createdProduct){
        throw new ApiError(500, "Something went wrong while adding the product")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdProduct, "Product added successfully")
    )  
})

const getProductById = asyncHandler( async (req,res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
}) 

const deleteProduct = asyncHandler( async (req,res) => {
    const { productId } = req.params;

    const product = await Product.findOneAndDelete({
        _id: productId,
    });

    if(!product){
        throw new ApiError(404, "Product not found or access denied");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product deleted successfully")
    );
})

// const updateProduct = asyncHandler( async (req,res) => {
//     const { productId } = req.params;
//     const { description, name, price, stock } = req.body; 
    
//     const updateData = {};

//     if( description !== undefined ) updateData.description = description;
//     if( name !== undefined ) updateData.name = name;
//     if( price !== undefined ) updateData.price = price;
//     if( stock !== undefined ) updateData.stock = stock;

//     const product = await Product.findByIdAndUpdate(
//         productId,
//         updateData,
//         { new: true }
//     );

//     if(!product){
//         throw new ApiError(404, "Product not found or access denied");
//     }

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, product, "Product updated successfully")
//     );
// })
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { description, name, price, stock } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // ---- Update text fields if provided ----
  if (description !== undefined) product.description = description;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  // ---- Handle image update if provided ----
  if (req.file) {
    const oldImageUrl = product.productImage;

    const productImageLocalPath = req.file.path;
    const uploadedImage = await uploadOnCloudinary(productImageLocalPath);

    if (!uploadedImage?.secure_url) {
      throw new ApiError(500, "Product image upload failed");
    }

    product.productImage = uploadedImage.secure_url;

    // delete old image after successful upload
    if (oldImageUrl) {
      await deleteFromCloudinary(oldImageUrl);
    }
  }

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


const getAllProducts = asyncHandler( async (req,res) => { 
    const products = await Product.find({});

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
})

// done completely with old image deletion; postman check DONE
const updateProductImage = asyncHandler( async (req,res) => {
    const { productId } = req.params;

    if( !req.file ){
        throw new ApiError(400, "Product image is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
    throw new ApiError(404, "Product not found");
    }

    const oldImageUrl = product.productImage;

    // upload new image

    const productImageLocalPath = req.file?.path;    

    const productImage = await uploadOnCloudinary(productImageLocalPath);

    if (!productImage?.secure_url) {
    throw new ApiError(500, "Product image upload failed");
    }

    // update DB
    product.productImage = productImage.secure_url;
    await product.save();

    // delete old image (after successful update)
    if (oldImageUrl) {
    await deleteFromCloudinary(oldImageUrl);
    }else{
        throw new ApiError(500, "Old product image url not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product image updated successfully")
    );
})



export {
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    updateProductImage,
}