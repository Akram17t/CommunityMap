const express = require("express");
const { getChatMessages, sendChatMessage } = require("./chats.service");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/:referenceCode", requireAuth, async (req, res, next) => {
  try {
    const messages = await getChatMessages(req.params.referenceCode, req.user);
    res.json({
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:referenceCode", requireAuth, async (req, res, next) => {
  try {
    const message = await sendChatMessage(req.params.referenceCode, req.user, req.body?.body);
    res.status(201).json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { chatsRouter: router };
