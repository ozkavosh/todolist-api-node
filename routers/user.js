const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const path = require("path");
const fs = require("fs");
const router = new express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  uploadImage,
  getImage,
  deleteImage,
  deleteUser
} = require("../controllers/user");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/me", auth, getMe);

router.put("/me", auth, updateProfile);

router.delete("/me", auth, deleteUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars");
  },
  filename: function (req, file, cb) {
    const avatars = fs.readdirSync('./public/avatars');
    const prevAvatar = avatars.find(avatar => avatar.includes(req.user.email));
    if(prevAvatar){
      fs.unlinkSync('./public/avatars/' + prevAvatar);
    }
    cb(null, `${req.user.email}${Math.random() * 9999}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  uploadImage,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", auth, deleteImage);

router.get("/:id/avatar", getImage);

module.exports = router;
