import express from "express";
import "dotenv/config";
const router = express.Router();
import dialogflow from "dialogflow";
import CREDENTIALS from "../config/credentials.js";

const projectId = CREDENTIALS.project_id;
const sessionId = "secret";
const languageCode = "en-US";

// configuration for the client
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
};

// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Text Query Route

router.post("/textQuery", async (req, res) => {
  // send info from client to dialogflow API
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        // text: req.body.text,
        text: req.body.text,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  res.send(result);
});

// Event Query Route

router.post("/eventQuery", async (req, res) => {
  //We need to send some information that comes from the client to Dialogflow API
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: req.body.event,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  // console.lo/g("Detected intent");
  const result = responses[0].queryResult;

  res.send(result);
});

export default router;
