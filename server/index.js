const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const rawData = fs.readFileSync("data.json");
const productData = JSON.parse(rawData);


app.get("/api", (req, res) => {
  res.json(productData);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

function findProduct(nameKey, productsArray, last_bidder, new_price) {
  for (let i = 0; i < productsArray.length; i++) {
    if (productsArray[i].name === nameKey) {
      productsArray[i].last_bidder = last_bidder;
      productsArray[i].price = new_price;
    }
  }
  const stringData = JSON.stringify(productData, null, 2);
  fs.writeFile("data.json", stringData, (err) => {
    console.error(err);
  });
}


io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });

  //Listens to the addProduct event
  socket.on('addProduct', (data) => {
    //console.log(data)
     productData["products"].push(data);
     const stringData = JSON.stringify(productData, null, 2);
     fs.writeFile("data.json", stringData, (err) => {
       console.error(err);
     });
     socket.broadcast.emit("addProductResponse", data);
  });
  //listens for bid product
  socket.on("bidProduct", (data) => {
    console.log(data)
    findProduct(
      data.name,
      productData["products"],
      data.last_bidder,
      data.amount
    );
    socket.broadcast.emit("bidProductResponse", data);
  })
});





const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Server running on port ${port} 🔥`));
