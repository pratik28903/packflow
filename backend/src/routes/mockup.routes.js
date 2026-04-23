import express from "express";
import Mockup from "../models/Mockup.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../../src/middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();


router.post(
  "/",
  protect,
  authorizeRoles("designer"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, price } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const mockup = await Mockup.create({
        title,
        description,
        price,
        imageUrl: `/uploads/${req.file.filename}`,
        designer: req.user._id,
      });

      res.status(201).json(mockup);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


router.get("/", protect, async (req, res) => {
  try {
    let mockups;

    if (req.user.role === "designer") {
      mockups = await Mockup.find({ designer: req.user._id });
    } else {
      mockups = await Mockup.find().populate("designer", "name");
    }

    res.json(mockups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put(
  "/:id",
  protect,
  authorizeRoles("designer"),
  upload.single("image"),
  async (req, res) => {
    try {
      const mockup = await Mockup.findById(req.params.id);

      if (!mockup) {
        return res.status(404).json({ message: "Mockup not found" });
      }

      // 🔒 owner check
      if (mockup.designer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const { title, description, price } = req.body;

      if (title) mockup.title = title;
      if (description) mockup.description = description;
      if (price) mockup.price = price;

      if (req.file) {
        mockup.imageUrl = `/uploads/${req.file.filename}`;
      }

      await mockup.save();

      res.json(mockup);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


router.delete(
  "/:id",
  protect,
  authorizeRoles("designer"),
  async (req, res) => {
    try {
      const mockup = await Mockup.findById(req.params.id);

      if (!mockup) {
        return res.status(404).json({ message: "Mockup not found" });
      }

      if (mockup.designer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }

      await mockup.deleteOne();

      res.json({ message: "Mockup deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


export default router;