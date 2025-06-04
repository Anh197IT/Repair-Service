const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

const categorieRouter = require("./routes/categorie.route");
const scategorieRouter = require("./routes/scategorie.route");
const articleRouter = require("./routes/article.route");
const userRouter = require("./routes/user.route");
const paymentRouter = require("./routes/payment.route");

dotenv.config();

const app = express(); // 💡 khai báo app trước khi dùng

// Configuration CORS
const corsOptions = {
    origin: ' http://localhost:4200', // ⚠️ thay thế bằng đúng URL frontend thật
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/categories', categorieRouter);
app.use('/api/scategories', scategorieRouter);
app.use('/api/articles', articleRouter);
app.use('/api/users', userRouter);
app.use('/api/payment', paymentRouter);

// MongoDB Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Kết nối MongoDB thành công"))
    .catch(err => {
        console.error("❌ Không thể kết nối MongoDB:", err);
        process.exit();
    });

// Root route
app.get("/", (req, res) => {
    res.send("bonjour");
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${process.env.PORT}`);
});

module.exports = app;
