import { Router } from "express";
import * as log from "../data/log.js";

var router = Router();

router.get("/", async (req, res) => {
  try {
    const logs = await log.getAllLogs();
    res.status(200).json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const logBody = req.body.body;
    const patient = req.body.patient;
    const date = req.body.date;
    const response = await log.createLogEntry(logBody, patient, date);
    if (!response.success) {
      return res.status(500).json({ error: "Failed to create log entry" });
    }
    const newLog = response.logEntry;
    newLog._id = newLog._id.toString();
    newLog.date = newLog.date.toString();
    res.status(201).json(newLog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const logId = req.params.id;
    const logEntry = await log.getLogEntryByID(logId);
    res.status(200).json(logEntry);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/:id/comment", async (req, res) => {
  try {
    const logId = req.params.id;
    const commentData = req.body.comment;
    const doctor = req.body.doctor;
    const updatedLog = await log.commentLogEntry(logId, commentData, doctor);
    if (!updatedLog.success) {
      return res.status(500).json({ error: "Failed to add comment" });
    }
    updatedLog._id = logId;
    updatedLog.date = new Date().toString();
    res.status(200).json(updatedLog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const logId = req.params.id;
    const deletedLog = await log.deleteLogEntry(logId);
    res.status(200).json(deletedLog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const logId = req.params.id;
    const updateData = req.body;
    const updatedLog = await log.updateLogEntry(logId, updateData);
    res.status(200).json(updatedLog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
