const express = require("express");
const fs = require("fs");

const router = express.Router();

const pathToCarts = "files/carrito.json";

if (fs.existsSync(pathToCarts)) {
  if (
    fs.readFileSync(pathToCarts, "utf-8") == "" ||
    fs.readFileSync(pathToCarts, "utf-8") == "[]"
  ) {
    try {
      fs.unlinkSync(pathToCarts);
    } catch (err) {
      console.error("Something wrong happened removing the file", err);
    }
  }
}

router.get("/:id/productos", async (req, res) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      res.status(400).send({ error: "not a number" });
    }
    if (!fs.existsSync(pathToCarts)) {
      res.send("there are no cart");
    }
    const data = await fs.promises.readFile(pathToCarts, "utf-8");
    let cartArray = JSON.parse(data);
    let filteredCart = cartArray.filter((p) => p.id == id);
    let products = filteredCart.products;
    if (filteredCart == "[]" || filteredCart == null) {
      res.status(400).send({ message: "this cart doesn't exist" });
    }
    if (products == "[]" || products == null) {
      res.send("there aren't products in this cart");
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(400).send({ message: "something go wrong", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    if (fs.existsSync(pathToCarts)) {
      let data = await fs.promises.readFile(pathToCarts, "utf-8");

      let cartArray = JSON.parse(data);
      console.log("1");
      let idd = cartArray[cartArray.length - 1].id + 1;
      let cart = { id: idd, timestap: Date.now(), products: [] };
      cartArray.push(cart);
      fs.promises.writeFile(pathToCarts, JSON.stringify(cartArray, null, 2));
    } else {
      let cart = { id: 1, timestap: Date.now(), products: [] };
      console.log(cart);
      await fs.promises.writeFile(pathToCarts, JSON.stringify([cart], null, 2));
      res.status(200).send({ message: "cart created succesfully" });
    }
  } catch (error) {
    res.status(400).send({ message: "something go wrong", err: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await fs.promises.readFile(pathToCarts, "utf-8");
    let cartArray = JSON.parse(data);
    if (isNaN(req.params.id)) {
      res.status(400).send({ error: "not a number" });
    }
    if (req.params.id < 1) {
      res.status(400).send({ message: "out of bounds" });
    }
    let index = cartArray.findIndex((u) => u.id == req.params.id);
    if (index == -1) {
      res
        .status(400)
        .send({ message: "it doesn't exist a product with this id" });
    }
    cartArray.splice(index, 1);
    fs.promises.writeFile(pathToProducts, JSON.stringify(cartArray, null, 2));
    res.status(200).send({ message: "product delated succesfuly" });
  } catch (err) {
    res.status(400).send({ message: "something go wrong" });
  }
});

router.post("/:id/productos/:id_prod", async (req, res) => {
  try {
    let id = req.params.id;
    let idprod = req.params.id_prod;
    if (isNaN(id) || isNaN(idprod)) {
      res.status(400).send({ message: "the id must be a number" });
    }
    if (id < 1 || idprod < 1) {
      res.status(400).send({ message: "Out of bounds" });
    }

    const cartData = await fs.promises.readFile(pathToCarts, "utf-8");
    const productData = await fs.promises.readFile(
      "files/products.json",
      "utf-8"
    );

    let cartArray = JSON.parse(cartData);
    let productArray = JSON.parse(productData);

    let filteredCart = cartArray.filter((p) => p.id == id);
    let filteredProduct = productArray.filter((p) => {
      p.id == idprod;
    });

    let cartIndex = cartArray.findIndex((u) => u.id == id);
    let productIndex = filteredProduct.findIndex((u) => {
      u.id == idprod;
    });

    if (cartIndex == -1) {
      res.status(400).send({ message: "the cart id is wrong" });
    }
    if (productIndex == -1) {
      res.status(400).send({ message: "the product id wrong" });
    }
    filteredCart.products.push(idprod);

    res.status(200).send({ message: "product added succesfully" });
  } catch (err) {
    res.status(400).send({ message: "something go wrong", error: err });
  }
});

router.delete("/:id/productos/:id_prods", async (req, res) => {
  try {
    let id = req.params.id;
    let idprod = req.params.id_prods;

    if (isNaN(id) || isNaN(idprod)) {
      res.status(400).send({ message: "the id must be a number" });
    }
    if (id < 1 || idprod < 1) {
      res.status(400).send({ message: "Out of bounds" });
    }

    const cartData = await fs.promises.readFile(pathToCarts, "utf-8");
    const productData = await fs.promises.readFile(
      "files/products.json",
      "utf-8"
    );

    let cartArray = JSON.parse(cartData);
    let productArray = JSON.parse(productData);

    let filteredCart = cartArray.filter((p) => p.id == id);
    let filteredProduct = productArray.filter((p) => {
      p.id == idprod;
    });

    let cartIndex = cartArray.findIndex((u) => u.id == id);
    let productIndex = filteredProduct.findIndex((u) => {
      u.id == idprod;
    });

    if (cartIndex == -1) {
      res.status(400).send({ message: "the cart id is wrong" });
    }
    if (productIndex == -1) {
      res.status(400).send({ message: "the product id wrong" });
    }

    let index = filteredCart.products.findIndex((u) => {
      u.id == idprod;
    });

    filteredCart.products.splice(index, 1);
  } catch (err) {
    res.status(400).send({ message: "something go wrong", error: err });
  }
});

module.exports = router;
