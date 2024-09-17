const fs = require("node:fs").promises;
const path = require("node:path");
const { nanoid } = require("nanoid");

// require automatycznie ładuje i parsuje plik JSON, zmieniając go na obiekt JavaScript
const contacts = require("./contacts.json");

const filename = "contacts.json";
const filePath = path.join(__dirname, filename);

const readContactsFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error.message);
    throw error;
  }
};

const writeContactsToFile = async (contacts) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error writing contacts:", error.message);
    throw error;
  }
};
const listContacts = async () => {
  try {
    return await readContactsFromFile();
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contactList = await readContactsFromFile();
    const oneContact = contactList.find((contact) => contact.id === contactId);
    return oneContact;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contactList = await readContactsFromFile();
    const filteredContacts = contactList.filter(
      (contact) => contact.id !== contactId
    );
    await writeContactsToFile(filteredContacts);
    return filteredContacts;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  const contactList = await readContactsFromFile();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contactList.push(newContact);
  await writeContactsToFile(contactList);
  return newContact;
};

const updateContact = async (contactId, body) => {
  try {
    const contactList = await readContactsFromFile();
    const contactIndex = contactList.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      return null;
    }
    const updatedContact = { ...contactList[contactIndex], ...body };
    contactList[contactIndex] = updatedContact;

    // contactList.splice(contactIndex, 1, updatedContact);

    await writeContactsToFile(contactList);
    return updatedContact;
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
