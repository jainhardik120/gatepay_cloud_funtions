/* eslint-disable object-curly-spacing */
const { onRequest } = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});
const { initializeApp } = require("firebase-admin/app");
const {getMessaging} = require("firebase-admin/messaging");

initializeApp();

exports.sendNotification = onRequest(async (req, res) => {
  try {
    const { deviceToken, message, title } = req.body;
    if (!deviceToken || !message || !title) {
      return res.status(400).json(
          { error: "Missing deviceToken or message or title" },
      );
    }
    const payload = {
      token: deviceToken,
      notification: {
        title: title,
        body: message,
      },
    };

    await getMessaging().send(payload);

    return res.status(200).json({ success: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
