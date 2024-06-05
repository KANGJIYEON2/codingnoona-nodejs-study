const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page = 1, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: "i" } } : {};

    const itemsPerPage = 5;
    const skipItems = (page - 1) * itemsPerPage;

    const totalItemNum = await Product.countDocuments(cond);
    const totalPageNum = Math.ceil(totalItemNum / itemsPerPage);

    const products = await Product.find(cond)
      .skip(skipItems)
      .limit(itemsPerPage)
      .exec();

    res.status(200).json({
      status: "success",
      totalPageNum,
      currentPage: page,
      totalItems: totalItemNum,
      products,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
