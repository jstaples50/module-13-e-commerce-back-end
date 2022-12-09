// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category

Product.belongsTo(Category, {
  foreignkey: "category",
});

// Categories have many Products

Category.hasMany(Product, {
  foreignkey: "product",
});

// Products belongToMany Tags (through ProductTag)

Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    as: "product_tag",
  },
});

// Tags belongToMany Products (through ProductTag)

Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    as: "product_tag",
  },
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
