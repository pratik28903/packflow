import express from "express";
import Mockup from "../models/Mockup.model.js";
import Order from "../models/Order.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let totalMockups = 0;
    let totalOrders = 0;
    let activeOrders = 0;
    let revenue = 0;


    if (role === "designer") {
      totalMockups = await Mockup.countDocuments({
        designer: userId,
      });

      const mockups = await Mockup.find({ designer: userId }).select("_id");
      const mockupIds = mockups.map((m) => m._id);

      totalOrders = await Order.countDocuments({
        mockup: { $in: mockupIds },
      });

      activeOrders = await Order.countDocuments({
        mockup: { $in: mockupIds },
        status: "active",
      });

      const revenueData = await Order.aggregate([
        { $match: { mockup: { $in: mockupIds } } },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      revenue = revenueData[0]?.total || 0;
    }


    else if (role === "client") {
      totalOrders = await Order.countDocuments({
        client: userId,
      });

      activeOrders = await Order.countDocuments({
        client: userId,
        status: "active",
      });

      const revenueData = await Order.aggregate([
        { $match: { client: userId } },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]);

      revenue = revenueData[0]?.total || 0;

      totalMockups = 0;
    }


    res.json({
      totalMockups,
      totalOrders,
      activeOrders,
      revenue,
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;


router.put("/:id", protect, async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id);

    if (!mockup) return res.status(404).json({ msg: "Not found" });

    if (mockup.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    mockup.title = req.body.title || mockup.title;
    mockup.description = req.body.description || mockup.description;
    mockup.price = req.body.price || mockup.price;

    const updated = await mockup.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id);

    if (!mockup) return res.status(404).json({ msg: "Not found" });

    if (mockup.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await mockup.deleteOne();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});