import strava from "./strava.js";

strava.makeRequest({
    method: 'get',
    url: '/athlete'
}).then(response => {
    console.log(response.data.firstname);
});