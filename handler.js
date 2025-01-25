import axios from 'axios'

/**
 * Fetches the authenticated athlete's data from the Strava API and sends it as a JSON response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the data is fetched and sent.
 * @throws {Error} - Throws an error if there is an issue fetching data from the API.
 */
export const athlete = async (req, res) => {
  try {
    const response = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`
      }
    });
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from API');
  }
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
  try {
    const response = await axios.get(`https://www.strava.com/api/v3/athletes/${process.env.STRAVA_ATHLETE_ID}/stats`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`
      }
    });
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from API');
  }
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
  try {
    const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`
      },
      params: {
        per_page: 10
      }
    });
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from API');
  }
}

