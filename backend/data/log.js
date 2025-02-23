import { log } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export async function getLogEntryByID(id) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID format. Expected a string.");
  }

  const logCollection = await log();
  const logEntry = await logCollection.findOne({ _id: new ObjectId(id) });

  if (!logEntry) throw new Error("logEntry not found");

  logEntry._id = logEntry._id.toString();
  return logEntry;
}

export async function createLogEntry(body, patient, date) {
  // * data validation
  // * check the inputs

  const logCollection = await log();

  const logEntry = {
    body,
    patient,
    date,
  };

  const insertInfo = await logCollection.insertOne(logEntry);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add post";
  const newId = insertInfo.insertedId.toString();
  const newLogEntry = await getLogEntryByID(newId);
  if (!newLogEntry) throw "newLogEntry not found";

  return { success: true, logEntry: newLogEntry };
}

export async function commentLogEntry(id, comment, doctor) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID format. Expected a string.");
  }

  const logCollection = await log();

  const updateInfo = await logCollection.updateOne(
    { _id: new ObjectId(id) },
    { $push: { comments: { text: comment, doctor, date: new Date() } } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Log entry not found or comment could not be added.");
  }

  return { success: true, message: "Comment added successfully." };
}

export async function getAllLogs() {
  const logCollection = await log();
  const logs = await logCollection.find({}).toArray();

  if (!logs) throw new Error("No logs found");

  return logs.map((logEntry) => {
    logEntry._id = logEntry._id.toString();
    return logEntry;
  });
}

export async function deleteLogEntry(id) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID format. Expected a string.");
  }

  const logCollection = await log();

  const deleteInfo = await logCollection.deleteOne({ _id: new ObjectId(id) });

  if (deleteInfo.deletedCount === 0) {
    throw new Error("Log entry not found or could not be deleted.");
  }

  return { success: true, message: "Log entry deleted successfully." };
}

export async function updateLogEntry(id, body, doctor, date) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID format. Expected a string.");
  }

  const logCollection = await log();

  const updateInfo = await logCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { body, doctor, date } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Log entry not found or could not be updated.");
  }

  return { success: true, message: "Log entry updated successfully." };
}
