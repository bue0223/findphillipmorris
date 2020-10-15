/* eslint-disable radix */
const express = require('express');
const axios = require('axios');
global.fetch = require('node-fetch');
const moment = require('moment');
require('moment-timezone');
const router = express.Router();
const uuidv4 = require('uuid/v4')
const ElasticSearch = require('../common/es');
const es = new ElasticSearch('https://search-pmftc-philipmorris-stg-b3j6h26w7rdx6hiuw2sytjvyaq.ap-southeast-1.es.amazonaws.com')

router.get('/env', async (req, res) => {
  let envVariables = {
    client_secret : process.env.clientSecret,
    client_id : process.env.clientId,
    username : process.env.user_name,
    password : process.env.password,
    authApi : process.env.authApi,
    addRewardApi : process.env.addRewardsApi
  }
  res.send(envVariables);
});

router.post('/obtain-auth-token', async (req, res) => {
  let payload = {};
  let response;
  let status = 500;
  let message = 'Internal Server Error';
  try {

    await axios({
      method: 'POST',
      url: process.env.oAuthTokenApi,
      config: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      data : req.body,
    }).then((res) => {
      console.log('RES!', res.data)
      response = res.data;
    }).catch((err) => {
      console.log('ERROR!', err);
    });

    if (response) {
      payload = response;
      status = 200;
      message = 'Success';
    }
  } catch (error) {
    console.log();
    payload,
    message = 'Internal Server Error';
  }
  res.status(status).send({
    payload,
    message,
    status,
  });
});

router.post('/week', async (req, res) => {
  let payload = {};
  let response;
  let status = 500;
  let message = 'Internal Server Error';
  try {
    let currentDate = moment();
    let toFind;
    let urlToFind;
    let initialDate;
    let getInitialDate = await es.getAllDocuments('variation');
    initialDate = getInitialDate[0].initial_date
    console.log('CUR_DATE_INFO', currentDate)
    console.log('FIRST_DATE_INFO', moment(initialDate))
    console.log('NO_OF_WEEKS_INFO' , parseInt(currentDate.diff(moment(initialDate), 'week')) + 1)
    switch(moment().format('dddd')){
      case 'Monday' :
        toFind = 'image/iconstofind-crest.png'
        urlToFind = "crest"
      break;
      case 'Tuesday' :
        toFind = 'image/iconstofind-PMlogo.png'
        urlToFind = "logo"
      break;
      case 'Wednesday' :
        toFind = 'image/iconstofind-PMSignature.png'
        urlToFind = "signature"
      break;
      case 'Thursday' :
        toFind = 'image/iconstofind-RedPack.png'
        urlToFind = "100sPack"
      break;
      case 'Friday' :
        toFind = 'image/iconstofind-Gentleman.png'
        urlToFind = "TheGentleman"
      break;
      case 'Saturday' :
        toFind = 'image/iconstofind-FirmStick.png'
        urlToFind = "firmstick"
      break;
      case 'Sunday' :
        toFind = 'image/iconstofind-crest.png'
        urlToFind = "crest"
      break;
    }
    response =  {
      week : parseInt(currentDate.diff(moment(initialDate), 'week')) + 1,
      toFind,
      urlToFind,
    }
    if(initialDate === '1111-11-11'){
      switch(getInitialDate[0].icon){
        case 'crest' :
          toFind = 'image/iconstofind-crest.png'
        break;
        case 'logo' :
          toFind = 'image/iconstofind-PMlogo.png'
        break;
        case 'signature' :
          toFind = 'image/iconstofind-PMSignature.png'
        break;
        case '100sPack' :
          toFind = 'image/iconstofind-RedPack.png'
        break;
        case 'TheGentleman' :
          toFind = 'image/iconstofind-Gentleman.png'
        break;
        case 'firmstick' :
          toFind = 'image/iconstofind-FirmStick.png'
        break;
      }
      response =  {
        week : parseInt(getInitialDate[0].week),
        toFind,
        urlToFind : getInitialDate[0].icon,
      }
    }
    if (response) {
      payload = response;
      status = 200;
      message = 'Success';
    }
  } catch (error) {
    console.log('ERROR_INFO', error);
    payload,
    message = 'Internal Server Error';
  }
  res.status(status).send({
    payload,
    message,
    status,
  });
});

router.post('/add-reward-points', async (req, res) => {
  let payload = {};
  let response;
  let status = 500;
  let message = 'Internal Server Error';
  try {
    console.log('Req body', req.body)
    const game_record = Object.assign({
      id: uuidv4(),
      created_at: moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
      spice_id : req.body.addRewardsParams.spice_person_id,
      reward_points : req.body.addRewardsParams.amount
    });
    response = await es.create(process.env.gameRecord_ES, game_record, game_record.id);
    if(response === 'created'){
      let getAuthToken = await axios.post('/api/obtain-auth-token', req.body.getTokenParams)
      if(getAuthToken.data.payload.access_token){
        req.body.addRewardsParams.game_reference_id = game_record.id
        console.log('ROBERTO', getAuthToken.data.payload.access_token)
        console.log('req.body.params', req.body.addRewardsParams)
        await axios({
          method: 'POST',
          url: process.env.gameTransactionApi,
          data : JSON.stringify(req.body.addRewardsParams) ,
          headers: {
            'Authorization': `Bearer ${getAuthToken.data.payload.access_token}`,
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
          },
        }).then((res) => {
          console.log('RES!', res.data)
          response = res.data;
        }).catch((err) => {
          console.log('ERROR!', err.response.config.config);
          console.log('ERROR!', err.response);
        });
      }
    }

    if (response) {
      payload = response;
      status = 200;
      message = 'Success';
    }
  } catch (error) {
    console.log(error);
    payload,
    message = 'Internal Server Error';
  }
  res.status(status).send({
    payload,
    message,
    status,
  });
});

router.get('/variation&icon=:icon&week=:week', async (req, res) => {
  let payload = {};
  let response;
  let status = 500;
  let message = 'Internal Server Error';
  try{
    console.log(req.params)
    const newWeekAndIcon = {
      doc: Object.assign({
        initial_date : moment('1111-11-11').format('YYYY-MM-DD'),
      }, req.params),
    };
    if(req.params.icon && req.params.week){
      let modifyWeekAndIcon = await es.update('variation', newWeekAndIcon, 'var_doc' )
      if(modifyWeekAndIcon === 'updated'){
        payload = 'Success'
        status = 200
        message = 'Success'
      }
      else if(modifyWeekAndIcon === 'noop'){
        payload = 'No operation performed'
        status = 200
        message = 'Success'
      }
    }
  }
  catch(err){
    console.log('error', err)
  }

  res.status(status).send({
    payload,
    message,
    status,
  });
});

router.get('/initial-date&initial_date=:initial_date', async (req, res) => {
  let payload = {};
  let response;
  let status = 500;
  let message = 'Internal Server Error';
  try{
    console.log(req.params)
    const setInitialDate = {
      doc: Object.assign({
      }, req.params),
    };
    if(req.params.initial_date){
      let modifyWeekAndIcon = await es.update('variation', setInitialDate, 'var_doc' )
      if(modifyWeekAndIcon === 'updated'){
        payload = 'Success'
        status = 200
        message = 'Success'
      }
      else if(modifyWeekAndIcon === 'noop'){
        payload = 'No operation performed'
        status = 200
        message = 'Success'
      }
    }
  }
  catch(err){
    console.log('error', err)
  }

  res.status(status).send({
    payload,
    message,
    status,
  });
});

module.exports = router;
