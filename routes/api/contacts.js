const express = require("express");
const router = express.Router();
const Contact = require("../../models/contact");

router.get("/", async (req, res, next) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
