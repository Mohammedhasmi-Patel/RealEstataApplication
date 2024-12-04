import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Hello from server",
  });
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this user" });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(401, "You do not have permission to delete this user")
    );
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    return res
      .status(200)
      .json({ success: true, message: "user has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};
