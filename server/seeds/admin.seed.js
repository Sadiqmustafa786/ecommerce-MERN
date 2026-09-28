import bcrypt from "bcrypt";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin@gmail.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.log(error.message);
  }
};

export default seedAdmin;
