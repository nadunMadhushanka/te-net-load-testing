require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL;

// Simple script to call 2 APIs
async function callAPIs() {
  try {
    // First API call
    console.log('Calling API 1...');
    const response1 = await axios.get(`${API_BASE_URL}/endpoint1`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('API 1 Response:', response1.data);

    // Second API call
    console.log('Calling API 2...');
    const response2 = await axios.post(`${API_BASE_URL}/endpoint2`, {
      // Request body data
      name: 'Test',
      value: 123
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('API 2 Response:', response2.data);

    console.log('Both APIs called successfully!');
  } catch (error) {
    console.error('Error calling APIs:', error);
  }
}

// Run the script
callAPIs();

