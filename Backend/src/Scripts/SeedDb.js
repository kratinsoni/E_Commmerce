import mongoose from "mongoose";
import dotenv from "dotenv";

import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database Connected.");

    // 2. Clear existing data
    // We still clear Orders because if we delete the Products/Users,
    // any existing Orders would become invalid (orphaned).
    console.log("Cleaning up old data...");
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Old data cleared.");

    // 3. Create Admin User
    // We need an Admin first because Products require an 'owner' field.
    console.log("Seeding Admin User...");

    const adminUser = await User.create({
      name: "admin user",
      email: "admin@example.com",
      password: "adminpassword123", // This triggers the pre-save hash hook
      role: "ADMIN",
    });

    console.log(`✅ Admin created: ${adminUser.email}`);

    // 4. Create Products
    console.log("Seeding Products...");

    const productsData = [
      {
        name: "MacBook Pro M3",
        description: "Latest Apple silicon chip, 16GB RAM.",
        price: 1999,
        stock: 15,
        productImage: "https://placehold.co/600x400",
        owner: adminUser._id, // Linking product to the Admin
      },
      {
        name: "Sony WH-1000XM5",
        description: "Industry leading noise canceling headphones.",
        price: 350,
        stock: 40,
        productImage: "https://placehold.co/600x400",
        owner: adminUser._id,
      },
      {
        name: "Logitech MX Master 3S",
        description: "Ergonomic performance mouse.",
        price: 99,
        stock: 100,
        productImage: "https://placehold.co/600x400",
        owner: adminUser._id,
      },
      {
        name: "4K Monitor 27-inch",
        description: "IPS Display with 144Hz refresh rate.",
        price: 450,
        stock: 10,
        productImage: "https://placehold.co/600x400",
        owner: adminUser._id,
      },
    ];

    await Product.insertMany(productsData);
    console.log(`✅ ${productsData.length} Products seeded successfully.`);

    // 5. Finish
    console.log("-----------------------------------");
    console.log("🌱 Admin & Products seeded successfully!");
    console.log("-----------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
