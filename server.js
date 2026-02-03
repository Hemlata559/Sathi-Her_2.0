const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://rkhushboo5477:Dhanush9140@cluster0.n3riouj.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));
// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Server running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
