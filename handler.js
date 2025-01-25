import axios from 'axios';
const fs = require('fs');

// Helper function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });
    process.env.STRAVA_ACCESS_TOKEN = tokenResponse.data.access_token;
    process.env.STRAVA_REFRESH_TOKEN = tokenResponse.data.refresh_token;

    // Update the .env file with the new tokens
    const envFilePath = './.env';
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');
    envFileContent = envFileContent.replace(/STRAVA_ACCESS_TOKEN=.*/, `STRAVA_ACCESS_TOKEN=${tokenResponse.data.access_token}`);
    envFileContent = envFileContent.replace(/STRAVA_REFRESH_TOKEN=.*/, `STRAVA_REFRESH_TOKEN=${tokenResponse.data.refresh_token}`);
    fs.writeFileSync(envFilePath, envFileContent);

    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Error refreshing access token');
  }
}

// Helper function to make API requests
const fetchData = async (url, res, params = {}) => {
  try {
    let response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`
      },
      params
    });
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Access token expired, refresh it
      try {
        const newAccessToken = await refreshAccessToken();
        // Retry the original request with the new access token
        response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${newAccessToken}`
          },
          params
        });
        res.json(response.data);
      } catch (tokenError) {
        res.status(500).send('Error refreshing access token');
      }
    } else {
      console.error(error);
      res.status(500).send('Error fetching data from API');
    }
  }
}

/**
 * Fetches the authenticated athlete's data from the Strava API and sends it as a JSON response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the data is fetched and sent.
 * @throws {Error} - Throws an error if there is an issue fetching data from the API.
 */
export const athlete = async (req, res) => {
  await fetchData('https://www.strava.com/api/v3/athlete', res);
}

/**
 * Fetches and returns the statistics of a Strava athlete.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 * @throws {Error} - Throws an error if there is an issue fetching data from the API.
 */
export const stats = async (req, res) => {
  await fetchData(`https://www.strava.com/api/v3/athletes/${process.env.STRAVA_ATHLETE_ID}/stats`, res);
}

/**
 * Fetches the latest activities of the authenticated athlete from the Strava API.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 * @throws {Error} - Throws an error if there is an issue fetching data from the API.
 */
export const activities = async (req, res) => {
  await fetchData('https://www.strava.com/api/v3/athlete/activities', res, { per_page: 10 });
}

