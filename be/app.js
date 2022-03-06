const express = require("express");
const app = express();
const morgan = require("morgan");
const port = 3000;

const productRoutes = require("./api/routes/products.js");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Hello world!",
  });
});

app.use("/products", productRoutes);
app.use("/order", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
