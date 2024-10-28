const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
} = require("../../service/services");

router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await listContacts(userId);
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", auth, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const contactData = {
      ...req.body,
      owner: req.user._id,
    };
    const newContact = await addContact(contactData);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", auth, async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", auth, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
});

router.patch("/:contactId/favorite", auth, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const updatedStatus = await updateStatus(contactId, { favorite });
    if (!updatedStatus) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedStatus);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
