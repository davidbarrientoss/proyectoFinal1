// falta el endpoint put 

const { urlencoded } = require("express");
const express = require("express");
const fs = require("fs");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const pathToProducts = "files/products.json";

if (fs.existsSync(pathToProducts)) {
  if (
    fs.readFileSync(pathToProducts, "utf-8") == "" ||
    fs.readFileSync(pathToProducts, "utf-8") == "[]"
  ) {
    try {
      fs.unlinkSync(pathToProducts);
    } catch (err) {
      console.error("Something wrong happened removing the file", err);
    }
  }
}

const admin = true;
const middlewareAuth = (req, res, next) => {
  if (!admin) {
    res.status(401).send({ message: "Unathorized" });
  } else {
    next();
  }
};

const middleware = (req, res, next) => {
  let product = req.body;
  console.log(product);
  if (
    !product.name ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.photo ||
    !product.stock
  ) {
    console.log("bad request");
    return { status: 400 };
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  if (fs.existsSync(pathToProducts)) {
    let data = await fs.promises.readFile(pathToProducts, "utf-8");
    let products = JSON.parse(data);
    res.send(products);
  } else {
    res.send("No hay productos");
  }
});

router.get("/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({ error: "not a number" });
  } else {
    if (!fs.existsSync(pathToProducts)) {
      res.send("there aren't products");
    }
    try {
      let data = await fs.promises.readFile(pathToProducts, "utf-8");
      let products = JSON.parse(data);
      let idd = req.params.id;
      let filteredProduct = products.filter((p) => p.id == idd);
      if (filteredProduct == "[]"||filteredProduct==null) {
        res.status(400).send({ message: "this product doesn't exist" });
      }
      res.status(200).send(filteredProduct)
    } catch (err) {
      return err;
    }      
  }
});

router.post("/", middlewareAuth, middleware, async (req, res) => {
  let product = req.body;
  if (fs.existsSync(pathToProducts)) {
    const data = await fs.promises.readFile(pathToProducts, "utf-8");
    let productArray = JSON.parse(data);
    product.timestamp = Date.now();
    let idd = productArray[productArray.length - 1].id;
    product.id = idd + 1;
    productArray.push(product);
    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify(productArray, null, 2)
    );
    res.status(200).send({ message: "product created succesufully" });
  } else {
    product.timestamp = Date.now();
    product.id = 1;
    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify([product], null, 2)
    );
    res.status(200).send({ message: "product created succesufully" });
  }
});

// router.put("/:id", middlewareAuth, async (req, res) => {
//   let idd = req.params.id;
//   if (isNaN(idd)) {
//     res.status(400).send({ message: `"${idd}" is not a number` });
//   }
//   if (req.params.id < 1) {
//     res.status(400).send({ message: "out of bounds" });
//   }
//   const data = await fs.promises.readFile(pathToProducts, "utf-8");
//   let products = JSON.parse(data);
//   let index = products.findIndex((u) => u.id == idd);
//   if (index == -1) {
//     res.status(400).send({ message: "it doesn't exist a product with this id" });
//   }
// });

router.delete("/:id", middlewareAuth, async (req, res) => {
  let data = await fs.promises.readFile(pathToProducts, "utf-8");
  let productArray = JSON.parse(data);
  if (isNaN(req.params.id)) {
    res.status(400).send({ error: "not a number" });
  }
  if (req.params.id < 1) {
    res.status(400).send({ message: "out of bounds" });
  }
  let index = productArray.findIndex((u) => u.id == req.params.id);
  if (index == -1) {
    res
      .status(400)
      .send({ message: "it doesn't exist a product with this id" });
  }
  productArray.splice(index, 1);
  fs.promises.writeFile(pathToProducts, JSON.stringify(productArray, null, 2));
  res.status(200).send({ message: "product delated succesfuly" });
});

module.exports = router;
