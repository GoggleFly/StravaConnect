import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const instance = axios.create({
    baseURL: 'https://www.strava.com/api/v3',
});

instance.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`;
    return config;
});

const makeRequest = async (config) => {
    try {
        const response = await instance(config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAccessToken()

            try {
                const response = await instance(config);
                return response;
            } catch {
                console.log('Error fetching data from API.');
            }  
        } else {
            console.log('Error fetching data from API.');
        }
    }
}

const refreshAccessToken = async () => {
    try {
        const response = await instance.post('https://www.strava.com/oauth/token', {}, {
            params: {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: process.env.STRAVA_REFRESH_TOKEN
            }
        });

        process.env.STRAVA_ACCESS_TOKEN = response.data.access_token;
        process.env.STRAVA_REFRESH_TOKEN = response.data.refresh_token;
        updateEnvionrmentVariables(response.data.access_token, response.data.refresh_token);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

const updateEnvionrmentVariables = (accessToken, refreshToken) => {
    const envFilePath = './.env';
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');
    envFileContent = envFileContent.replace(/STRAVA_ACCESS_TOKEN=.*/, `STRAVA_ACCESS_TOKEN=${accessToken}`);
    envFileContent = envFileContent.replace(/STRAVA_REFRESH_TOKEN=.*/, `STRAVA_REFRESH_TOKEN=${refreshToken}`);
    fs.writeFileSync(envFilePath, envFileContent);
}