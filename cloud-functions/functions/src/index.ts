const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

const db = new Firestore({
  projectId: 'projet-s9-oratio',
});

app.post('/checkHelper', (request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  if (request.body.gmail === undefined) {
    response.status(400).send({
      success: false,
      error: 'Missing \'gmail\' parameter.'
    });
    return;
  }
  const usersRef = db.collection('Users');
  usersRef.get()
  .then((docSnapshot: any) => {
      let helperInfo: any;
      docSnapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.isHelper === true && data.gmail === request.body.gmail) { helperInfo = data; }
      });
      let body: any;
      if (helperInfo !== undefined) {
        body = {
          exists: true,
          info: helperInfo
        };
      } else {
        body = { exists: false };
      }
      response.status(200).send(body);
      return;        
  });
});

app.post('/addUser', (request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  const newUser: any = {
    access_token: request.body.access_token,
    gmail: request.body.gmail,
    username: request.body.username,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    cellphone: request.body.cellphone,
    birth: request.body.birth,
    isHelper: request.body.isHelper
  };
  if (request.body.password !== undefined) { newUser.password = request.body.password; }
  if (request.body.supervision !== undefined) { newUser.supervision = request.body.supervision; }
  if (request.body.helper !== undefined) { newUser.helper = request.body.helper; }

  const usersRef = db.collection('Users');
  usersRef.add(newUser)
  .then((ref: any) => {
    console.log('Added document with ID: ', ref.id);
    response.status(200).send({
      success: true,
      document: newUser
    });
  });
});

exports.API = functions.https.onRequest(app);
