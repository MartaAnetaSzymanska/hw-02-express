const fs = require("node:fs").promises;
const path = require("node:path");

const contactsPath = "./contacts.json";

const listContacts = async () => {
  const file = fs.readFile(path.resolve(contactsPath));
  file.then((data) => {
    const dataStr = data.toString();
    console.table(JSON.parse(dataStr));
  });
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
