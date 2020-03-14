/* eslint-disable  func-names */
/* eslint-disable  no-console */
 
const Alexa = require('ask-sdk-core');
const Aws = require('aws-sdk');
 
function submit(item)
{
  var speechOutput = "";
  var senddata = {
    topic: 'homeapp/to',
    payload: JSON.stringify({
      "resource":     item.resource,
      "command":      item.command,
      "parameters":   item.params,
    }),
    qos: 1
  };
  var iotdata = new Aws.IotData({endpoint: ENDPOINT});
 
  return new Promise((resolve, reject) => {
    iotdata.publish(senddata, function(err, data) {
      if(err) {
        console.log("Failure: ",err);
        speechOutput = FAILURE_MESSAGE;
        reject(speechOutput);
      } else {
        console.log("Success");
        speechOutput = item.speech;
        resolve(speechOutput);
      }
    });
  });
}
 
const IntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    var ret = false;
    if (request.type === 'IntentRequest'){
      if (request.intent.name in data) {
        ret = true;
      }
    }
    return ret;
  },
  async handle(handlerInput) {
    var item = data[handlerInput.requestEnvelope.request.intent.name];
    var speechOutput = await submit(item);
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, speechOutput)
      .getResponse();
  },
};
 
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};
 
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};
 
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
 
    return handlerInput.responseBuilder.getResponse();
  },
};
 
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
 
    return handlerInput.responseBuilder
      .speak('エラーが発生しました。')
      .getResponse();
  },
};
 
const SKILL_NAME = 'AlexaHome';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = '家電を操作します。対象の機器とコマンドを言ってください。';
const HELP_REPROMPT = '対象の機器とコマンドを言ってください。';
const STOP_MESSAGE = 'さようなら';
const FAILURE_MESSAGE = '失敗しました!';
const ENDPOINT = "";
 
const data = {
  'TVONOFF': { 'resource': 'tv', 'command': 'power', 'params': 'on', 'speech': 'テレビにお願いしただす' }, 
  'LIGHT_ON': { 'resource': 'light', 'command': 'power', 'params': 'on', 'speech': '照明をつけました。' }, 
  'LIGHT_OFF': { 'resource': 'light', 'command': 'power', 'params': 'off', 'speech': '照明を消しました。' }, 
  'LIGHT_RELAX': { 'resource': 'light', 'command': 'mode', 'params': 'relax', 'speech': '照明をリラックスモードにしました。' }, 
  'LIGHT_SLEEP': { 'resource': 'light', 'command': 'mode', 'params': 'sleep', 'speech': '照明を常夜灯にしました。' }, 
};
 
// const skillBuilder = Alexa.SkillBuilders.standard();
const skillBuilder = Alexa.SkillBuilders.custom();
 
exports.handler = skillBuilder
  .addRequestHandlers(
    IntentHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();