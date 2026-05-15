// Backend v3.0 - Per-user auth + Admin dashboard
require("dotenv").config();

// DNS fallback for MongoDB Atlas SRV resolution
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { authMiddleware, adminMiddleware, generateToken } = require("./middleware/auth");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

/* ===========================================
   MIDDLEWARE
=========================================== */
app.use(cors());
app.use(express.json());

/* ===========================================
   SOCKET.IO SETUP
=========================================== */

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("userMessage", async (message) => {
    try {
      const holdings = await HoldingsModel.find({});
      const orders = await OrdersModel.find({});

      let reply = "";
      const lowerMsg = message.toLowerCase();

      if (lowerMsg === "hi" || lowerMsg === "hello" || lowerMsg.includes("hey")) {
        reply = "Hello there! I am your trading assistant. You can ask me about your portfolio, current holdings, or past orders.";
      } else if (lowerMsg.includes("portfolio") || lowerMsg.includes("holding") || lowerMsg.includes("stock")) {
        reply = `You currently hold ${holdings.length} stocks in your portfolio.`;
      } else if (lowerMsg.includes("order") || lowerMsg.includes("history") || lowerMsg.includes("transaction")) {
        reply = `You have placed a total of ${orders.length} orders so far.`;
      } else {
        reply = "I'm still learning! For now, you can ask me about your **portfolio**, your **holdings**, or your past **orders**.";
      }

      socket.emit("aiMessage", reply);
    } catch (error) {
      socket.emit("aiMessage", "AI assistant failed to respond.");
    }
  });

  socket.on("disconnect", () => {
    // Silent disconnect
  });
});

const https = require("https");

/* ===========================================
   CHATBOT ROUTE (AI ASSISTANT) - POWERED BY GROQ
=========================================== */
app.post("/chat", authMiddleware, async (req, res) => {
  try {
    const message = req.body.message || "";
    
    // Fetch user specific data
    const holdings = await HoldingsModel.find({ userId: req.userId });
    const orders = await OrdersModel.find({ userId: req.userId });
    
    let totalInvestment = 0;
    let currentValue = 0;
    holdings.forEach(h => {
      totalInvestment += h.avg * h.qty;
      currentValue += h.price * h.qty;
    });
    const pnl = currentValue - totalInvestment;

    const systemPrompt = `You are Wave AI, an elite, highly intelligent trading assistant for the Wave platform.
The user is securely authenticated. Here is their LIVE portfolio data:
- Stocks Held: ${holdings.length}
- Total Investment: ₹${totalInvestment.toFixed(2)}
- Current Portfolio Value: ₹${currentValue.toFixed(2)}
- Total Profit/Loss (P&L): ₹${pnl.toFixed(2)}
- Total Orders History: ${orders.length} orders

Instructions:
1. Answer the user's query naturally and concisely. You are a conversational AI, not a robot.
2. If they ask about their portfolio, profit, or loss, use the exact numbers provided above.
3. If they ask how to buy or sell, tell them to type 'buy [STOCK] [QTY] [PRICE]' or 'sell [STOCK] [QTY] [PRICE]'.
4. Keep responses strictly under 3 sentences unless they ask for a deep analysis. Do not hallucinate data.`;

    const payload = JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 150
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const reqGroq = https.request(options, (resGroq) => {
      let data = '';
      
      resGroq.on('data', (chunk) => {
        data += chunk;
      });
      
      resGroq.on('end', () => {
        try {
          if (resGroq.statusCode !== 200) {
            console.error("Groq API error:", data);
            return res.json({ reply: "I'm having trouble connecting to my neural network right now. Please try again later." });
          }
          
          const groqData = JSON.parse(data);
          const reply = groqData.choices[0]?.message?.content || "I couldn't process that.";
          res.json({ reply });
        } catch (e) {
          console.error("Error parsing Groq response:", e);
          res.status(500).json({ error: "Failed to parse AI response" });
        }
      });
    });

    reqGroq.on('error', (e) => {
      console.error("HTTPS request error:", e);
      res.status(500).json({ error: "Failed to reach AI provider" });
    });

    reqGroq.write(payload);
    reqGroq.end();

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

/* ===========================================
   START SERVER
=========================================== */


/* ===========================================
   AUTH ROUTES (Public)
=========================================== */

// Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      balance: 0,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user info
app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user info" });
  }
});

/* ===========================================
   PROTECTED DATA ROUTES (Per-User)
=========================================== */

app.get("/allHoldings", authMiddleware, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ userId: req.userId });
    res.status(200).json(holdings);
  } catch {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", authMiddleware, async (req, res) => {
  try {
    const positions = await PositionsModel.find({ userId: req.userId });
    res.status(200).json(positions);
  } catch (err) {
    console.error("Positions error:", err.message);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Watchlist (all stocks, not user-specific — this is the stock catalog)
app.get("/allWatchlist", async (req, res) => {
  try {
    const watchlist = await HoldingsModel.find({});
    res.status(200).json(watchlist);
  } catch {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

/* ===========================================
   FUNDS ROUTES (Per-User)
=========================================== */

app.get("/funds/balance", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.status(200).json({ balance: user.balance });
  } catch {
    res.status(500).json({ error: "Failed to get balance" });
  }
});

app.post("/funds/add", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const user = await UserModel.findById(req.userId);
    user.balance += Number(amount);
    await user.save();

    res.status(200).json({ message: "Funds added", balance: user.balance });
  } catch {
    res.status(500).json({ error: "Failed to add funds" });
  }
});

app.post("/funds/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const user = await UserModel.findById(req.userId);
    if (user.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    user.balance -= Number(amount);
    await user.save();

    res.status(200).json({ message: "Funds withdrawn", balance: user.balance });
  } catch {
    res.status(500).json({ error: "Failed to withdraw" });
  }
});

/* ===========================================
   ORDER PROCESSING (Per-User)
=========================================== */

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    let { name, qty, price, mode } = req.body;
    const userId = req.userId;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    qty = Number(qty);
    price = Number(price);

    if (qty <= 0 || price <= 0) {
      return res.status(400).json({ error: "Invalid quantity or price" });
    }

    const totalAmount = qty * price;

    // Check funds for BUY
    if (mode === "BUY") {
      const user = await UserModel.findById(userId);
      if (user.balance < totalAmount) {
        return res.status(400).json({
          error: `Insufficient funds. Available: ₹${user.balance.toLocaleString("en-IN")}`,
        });
      }
    }

    /* ---------- Save Order ---------- */
    await OrdersModel.create({ userId, name, qty, price, mode });

    /* ---------- BUY LOGIC ---------- */
    if (mode === "BUY") {
      const holding = await HoldingsModel.findOne({ userId, name });

      if (holding) {
        const newQty = holding.qty + qty;
        const totalInvestment = holding.avg * holding.qty + price * qty;
        holding.qty = newQty;
        holding.avg = totalInvestment / newQty;
        holding.price = price;
        await holding.save();
      } else {
        await HoldingsModel.create({
          userId, name, qty,
          avg: price, price,
          net: "0%", day: "0%", isLoss: false,
        });
      }

      // Update Position
      const position = await PositionsModel.findOne({ userId, name });
      if (position) {
        const newQty = position.qty + qty;
        const totalCost = position.avg * position.qty + price * qty;
        position.qty = newQty;
        position.avg = totalCost / newQty;
        position.price = price;
        position.netPercent = ((price - position.avg) / position.avg) * 100;
        position.isLoss = price < position.avg;
        await position.save();
      } else {
        await PositionsModel.create({
          userId, product: "CNC", name, qty,
          avg: price, price,
          netPercent: 0, dayPercent: 0, isLoss: false,
        });
      }

      // Deduct funds
      await UserModel.findByIdAndUpdate(userId, { $inc: { balance: -totalAmount } });
    }

    /* ---------- SELL LOGIC ---------- */
    if (mode === "SELL") {
      const holding = await HoldingsModel.findOne({ userId, name });
      if (!holding) return res.status(400).json({ error: "Stock not found in holdings" });
      if (holding.qty < qty) return res.status(400).json({ error: "Not enough quantity to sell" });

      holding.qty -= qty;
      holding.price = price;
      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ userId, name });
      } else {
        await holding.save();
      }

      // Update Position
      const position = await PositionsModel.findOne({ userId, name });
      if (position) {
        position.qty -= qty;
        position.price = price;
        position.netPercent = ((price - position.avg) / position.avg) * 100;
        position.isLoss = price < position.avg;
        if (position.qty <= 0) {
          await PositionsModel.deleteOne({ userId, name });
        } else {
          await position.save();
        }
      }

      // Add funds
      await UserModel.findByIdAndUpdate(userId, { $inc: { balance: totalAmount } });
    }

    /* ---------- Real-Time Update ---------- */
    const updatedHoldings = await HoldingsModel.find({ userId });
    io.emit("portfolioUpdated", updatedHoldings);

    res.status(201).json({ message: "Order processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process order" });
  }
});

app.post("/createTicket", async (req, res) => {
  try {
    const { category, topic } = req.body;
    if (!category || !topic) return res.status(400).json({ error: "Missing fields" });
    console.log("New Ticket:", category, topic);
    res.status(201).json({ message: "Ticket created successfully" });
  } catch {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

/* ===========================================
   ADMIN ROUTES
=========================================== */

// Get all users (admin only)
app.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get specific user's data (admin only)
app.get("/admin/user/:userId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).select("-password");
    const holdings = await HoldingsModel.find({ userId });
    const orders = await OrdersModel.find({ userId }).sort({ createdAt: -1 });
    const positions = await PositionsModel.find({ userId });

    // Calculate P&L
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    holdings.forEach((h) => {
      totalInvestment += h.avg * h.qty;
      totalCurrentValue += h.price * h.qty;
    });

    res.status(200).json({
      user,
      holdings,
      orders,
      positions,
      analytics: {
        totalInvestment,
        totalCurrentValue,
        totalPnL: totalCurrentValue - totalInvestment,
        totalOrders: orders.length,
        buyOrders: orders.filter((o) => o.mode === "BUY").length,
        sellOrders: orders.filter((o) => o.mode === "SELL").length,
      },
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get market analytics (admin only)
app.get("/admin/analytics", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await UserModel.countDocuments({ role: "user" });
    const allOrders = await OrdersModel.find({});
    const allHoldings = await HoldingsModel.find({});

    // Most traded stocks
    const stockCounts = {};
    allOrders.forEach((o) => {
      stockCounts[o.name] = (stockCounts[o.name] || 0) + o.qty;
    });
    const topStocks = Object.entries(stockCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, totalQty]) => ({ name, totalQty }));

    // Total volume
    const totalVolume = allOrders.reduce((acc, o) => acc + o.price * o.qty, 0);

    // Total platform P&L
    let platformInvestment = 0;
    let platformValue = 0;
    allHoldings.forEach((h) => {
      platformInvestment += h.avg * h.qty;
      platformValue += h.price * h.qty;
    });

    res.status(200).json({
      totalUsers: users,
      totalOrders: allOrders.length,
      totalVolume,
      platformPnL: platformValue - platformInvestment,
      topStocks,
      recentOrders: allOrders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20),
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/* ===========================================
   404 HANDLER
=========================================== */

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ===========================================
   SEED ADMIN + START SERVER
=========================================== */

const seedAdmin = async () => {
  try {
    const adminExists = await UserModel.findOne({ email: "admin@stm.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("stm!@#$%", 10);
      await UserModel.create({
        name: "Admin",
        email: "admin@stm.com",
        password: hashedPassword,
        role: "admin",
        balance: 0,
      });
      console.log("✅ Admin user seeded: admin@stm.com");
    }
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }
};

mongoose
  .connect(uri)
  .then(async () => {
    console.log("MongoDB Connected");

    await seedAdmin();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
