const Contact = require("../models/contact");

const listContacts = async () => {
  return await Contact.find({});
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async ({ name, email, phone }) => {
  const newContact = new Contact({ name, email, phone });
  return await newContact.save();
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
  } catch (err) {
    console.error("Error removing contact:", err);
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatus = async (contactId, { favorite }) => {
  return await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
};
