/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports en-US lauguage.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-query
 **/

'use strict';

const Alexa = require('alexa-sdk');
const where = require('node-where');

const querys = require('./query');
const languages = require('./languages');
const kid = require('./kid');

const GAME_STATES = {
    DOCTOR: '_DOCTORMODE' // Asking query querys.
};

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL)

const newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = GAME_STATES.DOCTOR;
        this.emitWithState('QuestionIntent', true);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.DOCTOR;
        this.emitWithState('QuestionIntent', true);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.DOCTOR;
        this.emitWithState('HelpUserIntent', true);
    },
    'Unhandled': function () {
        const speechOutput = this.t('DOCTOR_UNHANDLED');
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
};

const queryStateHandlers = Alexa.CreateStateHandler(GAME_STATES.DOCTOR, {
    'QuestionIntent': function () {
        const self = this;
        self.handler.state = GAME_STATES.DOCTOR;
        // TODO: prompt the user for a query.
        const message = this.t('QUESTION_MESSAGE')
        self.response.speak(message).listen(message);
        self.emit(":responseReady");
    },
    'DoctorIntent': function() {
        const self = this;
        self.handler.state = GAME_STATES.QUESTION;
        const intent = self.event.request.intent;
        const query = intent.slots.Query.value || '';
        const location = intent.slots.City.value || '';
        console.log('DoctorIntent query: ' + query);
        if (!location) {
            self.emitWithState('AMAZON.RepeatIntent', false);
            return;
        }

        where.is(location, function(err, result) {
            if (err) {
                const message = `${err}, try another query.`;
                self.response.speak(message).listen(message);
                self.emit(':responseReady');
                return;
            }

            const city = result.get('city');
            const code = result.get('regionCode');

            const locationSlug = `${code}-${city}`.toLowerCase();
            console.log('locationSlug: ' + locationSlug);

            kid.getDoctors(locationSlug).then((res) => {
                const doctorResponse = kid.process(res);
                self.response.speak(message).listen(message);
                self.emit(':responseReady');
            }).catch((err) => {
                const message = `${err}, say another query.`;
                self.response.speak(message).listen(message);
                self.emit(':responseReady');
            });

        });
    },

    /* Amazon intents below */

    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.QUESTION;
        this.emitWithState('QuestionIntent', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes['speechOutput']).listen(this.attributes['repromptText']);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        const askMessage = newGame ? this.t('ASK_MESSAGE_QUESTION') : this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
        const speechOutput = this.t('HELP_MESSAGE', GAME_LENGTH) + askMessage;
        const repromptText = this.t('HELP_REPROMPT') + askMessage;

        this.response.speak(speechOutput).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        const speechOutput = this.t('STOP_MESSAGE');
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('CANCEL_MESSAGE'));
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        const speechOutput = this.t('QUESTION_UNHANDLED', ANSWER_COUNT.toString());
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended in query state: ${this.event.request.reason}`);
    },
});

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languages.languageString;
    alexa.registerHandlers(newSessionHandlers, queryStateHandlers);
    alexa.execute();
};
