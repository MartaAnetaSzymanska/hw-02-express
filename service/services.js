const sharp = require("sharp");
const Contact = require("../models/contact");
const path = require("path");
const fs = require("fs").promises;

const listContacts = async (userId) => {
  return await Contact.find({ owner: userId });
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
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
const isImageAndTransform = async (newAvatarPath) => {
  try {
    const image = sharp(newAvatarPath);

    const tempOutputPath = path.join(
      path.dirname(newAvatarPath),
      `temp-${path.basename(newAvatarPath)}`
    );

    await image.rotate(360).resize(250, 250).toFile(tempOutputPath);
    await fs.rename(tempOutputPath, newAvatarPath);

    console.log("Image processed successfully");
    return true;
  } catch (err) {
    console.log("Error during image processing:", err);
    return false;
  }
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
  isImageAndTransform,
};
