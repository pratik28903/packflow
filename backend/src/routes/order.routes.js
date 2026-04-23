import express from "express";
import Order from "../models/Order.model.js";
import Mockup from "../models/Mockup.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ CREATE ORDER
router.post("/", protect, async (req, res) => {
  try {
    const { mockupId, quantity } = req.body;

    if (!mockupId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const mockup = await Mockup.findById(mockupId);

    if (!mockup) {
      return res.status(404).json({ message: "Mockup not found" });
    }

    const price = Number(mockup.price);
    const qty = Number(quantity);

    const order = await Order.create({
      mockup: mockupId,
      client: req.user._id,
      quantity: qty,
      price: price,
      amount: price * qty,
    });

    res.status(201).json(order);

  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL ORDERS
router.get("/", protect, async (req, res) => {
  try {
    let orders;

    if (req.user.role === "client") {
      orders = await Order.find({ client: req.user._id })
        .populate("mockup", "title imageUrl description price")
        .populate("client", "name");
    } else {
      orders = await Order.find()
        .populate({
          path: "mockup",
          match: { designer: req.user._id },
          select: "title imageUrl description price",
        })
        .populate("client", "name");
    }

    const filtered = orders.filter((o) => o.mockup !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ RECENT ORDERS
router.get("/recent", protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "client") {
      query.client = req.user._id; // ✅ only this client's orders
    } else {
      // designer → only orders of his mockups
      query = {}; // we'll filter using populate match
    }

    const orders = await Order.find(query)
      .populate({
        path: "mockup",
        match: req.user.role === "designer"
          ? { designer: req.user._id }
          : {},
        select: "title imageUrl description price", // ✅ FIX
      })
      .populate("client", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // remove null mockups (important for designer)
    const filtered = orders.filter((o) => o.mockup !== null);

    const formatted = filtered.map((o) => ({
      _id: o._id,
      title: o.mockup?.title,
      imageUrl: o.mockup?.imageUrl,
      clientName: o.client?.name,
      quantity: o.quantity,
      amount: o.amount,
      status: o.status,
      createdAt: o.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Recent orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    // ✅ Only designer can change to Editing
    if (req.user.role !== "designer") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE STATUS
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "Approved", "Completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate("mockup");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.mockup.designer.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;