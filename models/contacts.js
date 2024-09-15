const fs = require("node:fs").promises;
const path = require("node:path");

require("nanoid");

// require automatycznie ładuje i parsuje plik JSON, zmieniając go na obiekt JavaScript
const contacts = require("./contacts.json");
const { nanoid } = require("nanoid");

const listContacts = async () => {
  try {
    return contacts;
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const oneContact = contacts.find((contact) => contact.id === contactId);
    return oneContact;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    return filteredContacts;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  return newContact;
};

const updateContact = async (contactId, body) => {
  try {
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      return null;
    }

    contacts[contactIndex] = {
      ...contacts[contactIndex],
      ...body,
    };

    return contacts[contactIndex];
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
