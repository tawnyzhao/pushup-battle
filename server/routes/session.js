var OpenTok = require('opentok'), opentok = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

var express = require('express');
var router = express.Router();

let sessions = {
  // roomID: {apiKey: API_KEY, roomID: ID, SessionID: ID, Tokens: [Token..]}
}

const genID = () => {
  let result;
  do {
    result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 4; i++) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (result in sessions); // potential infinite loop if all id's are used

  return result;
}

/* GET create session ID. */
router.get('/', function(req, res, next) {
  opentok.createSession(function(err, session) {
    if (err) return console.log(err);

    const room = genID();

    let tokenOptions = {};
    tokenOptions.role = "publisher";
    //tokenOptions.data = "username=bob";

    // Generate a token.
    const token = opentok.generateToken(session.sessionId, tokenOptions);

    // save the session, room, and the requester's token
    sessions[room] = {apiKey: process.env.API_KEY, roomID: room, sessionID: session.sessionId, tokens: [token]};

    return res.json(sessions[room]);
  });
  //
});

router.post('/', function(req, res, next) {
  if (!("roomID" in req.body)) return res.json({status: 'error'});

  // non existent room 
  if (!(req.body.roomID in sessions)) return res.json({status: 'error'});

  let sessionID = sessions[req.body.roomID].sessionID;

  let tokenOptions = {};
  tokenOptions.role = "publisher";
  //tokenOptions.data = "username=bob";

  // Generate a token.
  const token = opentok.generateToken(sessionID, tokenOptions);

  // save token
  sessions[req.body.roomID].tokens.push(token);

  return res.json({apiKey: process.env.API_KEY, token: token, status: 'success'});
});

module.exports = router;
