import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, Message: "User Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, Message: "internal server error" });
  }
};
