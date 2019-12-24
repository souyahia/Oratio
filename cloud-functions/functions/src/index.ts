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

app.post('/checkUser', (request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  const gmail: string = request.body.gmail;
  console.log(`< /checkUser > Received request for ${gmail}.`);
  if (gmail === undefined) {
    response.status(400).send({
      success: false,
      error: 'Missing \'gmail\' parameter.'
    });
    console.log(`< /checkUser > Undefined parameter.`);
    return;
  }
  const usersRef = db.collection('Users');
  usersRef.get()
  .then((docSnapshot: any) => {
      let userInfo: any;
      docSnapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.gmail === gmail) { userInfo = data; }
      });
      let body: any;
      if (userInfo !== undefined) {
        body = {
          exists: true,
          info: userInfo
        };
        console.log(`< /checkUser > ${gmail} exists.`);
      } else {
        body = { exists: false };
        console.log(`< /checkUser > ${gmail} does not exist.`);
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
  console.log(`< /addUser > Received request for ${newUser.gmail}.`);
  if (request.body.password !== undefined) { newUser.password = request.body.password; }
  if (request.body.supervision !== undefined) { newUser.supervision = request.body.supervision; }
  if (request.body.helper !== undefined) { newUser.helper = request.body.helper; }

  const usersRef = db.collection('Users');
  usersRef.get()
  .then((docSnapshot: any) => {
      let userInfo: any;
      docSnapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.gmail === newUser.gmail) { userInfo = data; }
      });
      if (userInfo !== undefined) {
        response.status(200).send({
          success: false,
          message: 'Gmail already taken.',
          document: userInfo
        });
        console.log(`< /addUser > ${newUser.gmail} already exists.`);
      } else {
        usersRef.add(newUser)
        .then((ref: any) => {
          console.log('Added document with ID: ', ref.id);
          response.status(200).send({
            success: true,
            document: newUser,
            message: 'User sucessfully added'
          });
          console.log(`< /addUser > ${newUser.gmail} added with ID: ${ref.id}`);
        });
      }
      return;        
  });
});

app.post('/updateUser', (request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  const userInfo: any = {
    access_token: request.body.access_token,
    gmail: request.body.gmail,
    username: request.body.username,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    cellphone: request.body.cellphone,
    birth: request.body.birth,
    isHelper: request.body.isHelper
  };
  console.log(`< /updateUser > Received request for ${userInfo.gmail}.`);
  if (request.body.password !== undefined) { userInfo.password = request.body.password; }
  if (request.body.supervision !== undefined) { userInfo.supervision = request.body.supervision; }
  if (request.body.helper !== undefined) { userInfo.helper = request.body.helper; }

  const usersRef = db.collection('Users');
  usersRef.get()
  .then((docSnapshot: any) => {
    let done: boolean = false;
    docSnapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.gmail === userInfo.gmail) {
        usersRef.doc(doc.id).update(userInfo);
        response.status(200).send({
          success: true,
          document: userInfo,
          message: 'User successfully updated.'
        });
        done = true;
        console.log(`< /updateUser > ${userInfo.gmail} updated.`);
        return;
      }
    });
    if (!done) {
      response.status(200).send({
        success: false,
        message: 'User does not exist.'
      });
      console.log(`< /updateUser > ${userInfo.gmail} not found.`);
    }
  });
});

app.post('/removeUser', (request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  const gmail: string = request.body.gmail;
  console.log(`< /removeUser > Received request for ${gmail}.`);
  const usersRef = db.collection('Users');
  usersRef.get()
  .then((docSnapshot: any) => {
    let done: boolean = false;
    docSnapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.gmail === gmail) {
        usersRef.doc(doc.id).delete();
        response.status(200).send({
          success: true,
          message: 'User successfully removed.'
        });
        done = true;
        console.log(`< /removeUser > ${gmail} deleted.`);
        return;
      }
    });
    if (!done) {
      response.status(200).send({
        success: false,
        message: 'User does not exist.'
      });
      console.log(`< /removeUser > ${gmail} not found.`);
    }
  });
});

exports.API = functions.https.onRequest(app);
