const library = (function () {
    const axios = require('axios');
    const api = require('./api');

    // const BASE_URL = "";
    const BASE_URL = "https://api.wolframalpha.com/v2";
    const DOCTOR_URL = "https://api.betterdoctor.com";
    const LIMIT = 3;
    
    const getRandom = (items) => {
        return items[Math.floor(Math.random() * items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    const getSearchResult = (query) => {
        return axios.get(`${BASE_URL}/query?input=${escape(query)}&format=plaintext&output=JSON&appid=DEMO`);
    }

    const processDoctors = (query, res) => {
        // console.log(JSON.stringify(res))
        res = res['data'].data.filter((d) => d['practices'] instanceof Array && d['practices'].length);
        const doctors = res.map((d) => {
            return d['practices'][0]['name'];
        });
        const doctorString = doctors.join(', ')
        let message = `We found the following doctors in your area for ${query}: `;
        message += `${doctorString}`;
        message += ". Would you like to make an appointment?"
        return message;
    }

    const getDoctorString = (data) => {
        return "doctors: " + data;
    }

    // locationSlug ex: ma-boston
    const getDoctors = (locationSlug) => {
        return axios.get(`${DOCTOR_URL}/2016-03-01/doctors?location=${locationSlug}&limit=${LIMIT}&user_key=${api.apiKey}`);
    }

    return {
        getRandom: getRandom,
        getDoctors: getDoctors,
        getDoctorString: getDoctorString,
        getSearchResult: getSearchResult,
        processDoctors: processDoctors,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;