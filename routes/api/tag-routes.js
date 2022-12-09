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

// router.post("/", async (req, res) => {
//   // create a new tag
//   try {
//     const tagData =  await Tag.create(req.body);

//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.post("/", async (req, res) => {
//   // create a new tag
//   try {
//     const tagDataFunction = async () => {
//       const tagData = await Tag.create(req.body);

//       if (req.body.productIds.length) {
//         const productTagIdArr = req.body.productIds.map((product_id) => {
//           return {
//             product_id,
//             tag_id: tagData.id,
//           };
//         });
//         await ProductTag.bulkCreate(productTagIdArr);
//         res.status(200).json(productTagIdArr);
//       }
//       res.status(200).json(tagData);
//     };

//     tagDataFunction();
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
