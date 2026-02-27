require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

/* ===========================================
   SOCKET.IO (Real-Time Chat Engine)
=========================================== */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userMessage", async (message) => {
    try {
      const holdings = await HoldingsModel.find({});
      const orders = await OrdersModel.find({});

      let reply = "I am your trading assistant.\n\n";

      if (message.toLowerCase().includes("portfolio")) {
        reply += `You currently hold ${holdings.length} stocks.`;
      } else if (message.toLowerCase().includes("orders")) {
        reply += `You have placed ${orders.length} orders so far.`;
      } else {
        reply += "Ask me about your portfolio, holdings, or orders.";
      }

      socket.emit("aiMessage", reply);
    } catch (error) {
      socket.emit("aiMessage", "AI assistant failed to respond.");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ===========================================
   MIDDLEWARE
=========================================== */

app.use(cors());
app.use(express.json());

/* ===========================================
   GET ROUTES
=========================================== */

app.get("/allHoldings", async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({});
    res.status(200).json(holdings);
  } catch {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const positions = await PositionsModel.find({});
    res.status(200).json(positions);
  } catch {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const orders = await OrdersModel.find({});
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/allWatchlist", async (req, res) => {
  try {
    const watchlist = await HoldingsModel.find({});
    res.status(200).json(watchlist);
  } catch {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

app.post("/createTicket", async (req, res) => {
  try {
    const { category, topic } = req.body;

    if (!category || !topic) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Save to DB (example)
    console.log("New Ticket:", category, topic);

    res.status(201).json({
      message: "Ticket created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

/* ===========================================
   ORDER PROCESSING
=========================================== */

app.post("/newOrder", async (req, res) => {
  try {
    let { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    qty = Number(qty);
    price = Number(price);

    if (qty <= 0 || price <= 0) {
      return res.status(400).json({ error: "Invalid quantity or price" });
    }

    /* ---------- Save Order ---------- */

    await OrdersModel.create({ name, qty, price, mode });

    /* ---------- BUY LOGIC ---------- */

    if (mode === "BUY") {
      const holding = await HoldingsModel.findOne({ name });

      if (holding) {
        const newQty = holding.qty + qty;
        const totalInvestment =
          holding.avg * holding.qty + price * qty;

        holding.qty = newQty;
        holding.avg = totalInvestment / newQty;
        holding.price = price;

        await holding.save();
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
          price,
          net: "0%",
          day: "0%",
          isLoss: false,
        });
      }
    }

    /* ---------- SELL LOGIC ---------- */

    if (mode === "SELL") {
      const holding = await HoldingsModel.findOne({ name });

      if (!holding) {
        return res.status(400).json({ error: "Stock not found in holdings" });
      }

      if (holding.qty < qty) {
        return res.status(400).json({ error: "Not enough quantity to sell" });
      }

      holding.qty -= qty;
      holding.price = price;

      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ name });
      } else {
        await holding.save();
      }
    }

    /* ---------- Real-Time Update ---------- */
    const updatedHoldings = await HoldingsModel.find({});
    io.emit("portfolioUpdated", updatedHoldings);

    res.status(201).json({
      message: "Order processed successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process order" });
  }
});

/* ===========================================
   404 HANDLER
=========================================== */

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ===========================================
   START SERVER
=========================================== */

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });