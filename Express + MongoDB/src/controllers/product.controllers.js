import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { name, price, category, discountPercenteage, visible, image } =
    req.body;
  try {
    const newProduct = await Product.create({
      name: name,
      price: price,
      category: category,
      discountPercenteage: discountPercenteage,
      visible: visible,
      image: image,
    });
    res.status(201).json({ id: newProduct._id });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id);
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(204).json({ message: "Producto borrado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const edit = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  console.log("ID: ", id);
  console.log("Payload: ", payload);
  try {
    const productUpdated = await Product.findByIdAndUpdate(id, payload);

    if (!productUpdated) {
      return res
        .status(404)
        .json({ message: "No hemos podido encontrar el producto" });
    }
    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getProductsWithOptions = async (req, res) => {
  const { name, price, category } = req.query;
  const searchQuery = {};
  const priceSortQuery = price == "asc" ? "asc" : "desc";

  if (name) {
    const partialMatchName = new RegExp(name, "i");
    searchQuery.name = partialMatchName;
  }

  if (price == "disc") {
    searchQuery.discountPercentage = { $exists: true };
  }

  if (category) {
    searchQuery.category = category;
  }

  console.log(searchQuery);

  try {
    const productsFound = await Product.find(searchQuery).sort({
      price: priceSortQuery,
    });

    if (productsFound.length >= 1) {
      return res.status(200).json(productsFound);
    }

    return res
      .status(404)
      .json({ message: "No hemos podido encontrar ningun producto" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
