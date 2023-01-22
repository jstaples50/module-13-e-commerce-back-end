const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: { model: Product },
    });

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: { model: Product },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag with that id found" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { productIds } = req.body;
    await Tag.create(req.body);

    const tag = await Tag.findOne({ where: { tag_name: req.body.tag_name } });

    if (productIds.length) {
      const tagIds = productIds.map((product_id) => {
        return {
          product_id,
          tag_id: tag.id,
        };
      });
      await ProductTag.bulkCreate(tagIds);
    }

    const postBulkCreate = await Tag.findOne({
      where: { tag_name: req.body.tag_name },
    });

    res.json(postBulkCreate);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.findOne({ where: { id: req.params.id } });
    if (!tag) {
      res.status(404).json({ message: "No tag with that id exists" });
      return;
    }

    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (!req.body.productIds) {
      res.status(200).json(tagData);
      return;
    }

    const currentProductTags = await ProductTag.findAll({
      where: { tag_id: req.params.id },
      attributes: ["product_id"],
      raw: true,
    });

    const newProductTags = req.body.productIds
      .filter((product_id) => !currentProductTags.includes(product_id))
      .map((product_id) => {
        return {
          product_id,
          tag_id: req.params.id,
        };
      });

    const productTagsToRemove = currentProductTags
      .filter(({ product_id }) => !req.body.productIds.includes(product_id))
      .map(({ product_id }) => product_id);

    console.log(productTagsToRemove);

    for (const product_id of productTagsToRemove) {
      await ProductTag.destroy({
        where: { product_id: product_id, tag_id: req.params.id },
      });
    }

    await ProductTag.bulkCreate(newProductTags);

    res
      .status(200)
      .json({ message: `Tag ${req.body.tag_name} successfully updated!` });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag with that id found" });
      return;
    }

    res
      .status(200)
      .json({ message: `Tag ${req.params.id} successfully deleted!` });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
