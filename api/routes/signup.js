const router = require("express").Router();
const mongoose = require("mongoose");
const sha256 = require("js-sha256").sha256;
const Users = require("../models/user");
const apiError = require("../error-handler/apiErrors");
const createJwtToken = require("../helper-methods/createJwtToken");
const validateEmail = require("../helper-methods/validateEmail");
const validatePassword = require("../helper-methods/validatePassword");
router.post("/local", async (req, res, next) => {
  const body = req.body;
  try {
    if (!validateEmail(body.email)) {
      next(apiError.badRequest("Enter valid email"));
      return;
    }
    if (!validatePassword(body.password)) {
      next(apiError.badRequest("Enter strong password"));
      return;
    }
    const userFound = await Users.findOne({ email: body.email }); // query to check if user with email already exist
    if (!userFound) {
      const user = new Users({
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        lastname: body.lastname,
        display_name: `${body.name} ${body.lastname}`,
        email: body.email,
        password: sha256(body.password.trim()),
        created_at: Date.now(),
      });
      const new_user = await user.save();
      const userObj = {
        user_id: new_user._id,
        name: new_user.name,
        lastname: new_user.lastname,
        email: new_user.email,
        created_at: new_user.created_at,
        display_name: new_user.display_name,
      };
      const token = createJwtToken(userObj);
      res.status(201).json({
        user: userObj,
        token,
      });
    } else {
      next(apiError.badRequest("User already exist with that email"));
      return;
    }
  } catch (error) {
    next(apiError.interServerError(error.message));
    return;
  }
});

module.exports = router;
