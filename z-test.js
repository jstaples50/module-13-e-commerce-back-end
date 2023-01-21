const router = require("express").Router();
const { Tag, Product, ProductTag } = require("./models");

const reqBodyProductIds = [5, 6];

const productTagTest = async () => {
  const productTags = await ProductTag.findAll({
    where: { tag_id: 5 },
  });
  console.log(productTags);
  const productTagIds = productTags.map(({ product_id }) => product_id);
  console.log("--------\n", productTagIds);
  const newProductTags = reqBodyProductIds
    .filter((product_id) => !productTagIds.includes(product_id))
    .map((product_id) => {
      return {
        product_id,
        tag_id: 5,
      };
    });
  console.log(newProductTags);
};

// const productTagIds = productTags.map(({ product_id }) => product_id);

// console.log(productTagIds);

productTagTest();
