const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function run() {
  try {
    fs.writeFileSync('test.txt', 'This is a test resume.');
    
    const form = new FormData();
    form.append('role', 'Developer');
    form.append('skills', 'JS');
    form.append('resumeFile', fs.createReadStream('test.txt'));
    
    console.log("Sending request...");
    const res = await axios.post('http://localhost:3000/api/mock', form, {
      headers: form.getHeaders ? form.getHeaders() : { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Backend returned error status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error connecting/sending:", err.message);
    }
  } finally {
    if (fs.existsSync('test.txt')) fs.unlinkSync('test.txt');
  }
}

run();
