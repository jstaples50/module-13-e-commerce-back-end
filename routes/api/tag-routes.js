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

router.post("/", (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            product_id,
            tag_id: tag.id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag with that id found" });
      return;
    }

    const productTags = await ProductTag.findAll({
      where: { tag_id: req.params.id },
    });

    const productTagIds = productTags.map(({ product_id }) => product_id);

    const newProductTags = req.body.productIds
      .filter((product_id) => !productTagIds.includes(product_id))
      .map((product_id) => {
        return {
          product_id,
          tag_id: req.params.id,
        };
      });

    // ****
    console.log(productTags);
    // ****

    const productTagsToRemove = productTags
      .filter(({ product_id }) => !req.body.productIds.includes(product_id))
      .map(({ id }) => id);

    const destroyTag = async () => {
      return ProductTag.destroy({ where: { id: productTagsToRemove } });
    };

    const createTags = async () => {
      return ProductTag.bulkCreate(newProductTags);
    };

    const promiseExecution = async () => {
      const runPromises = await Promise.all([destroyTag(), createTags]);
    };

    const updatedProductTags = promiseExecution();

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
