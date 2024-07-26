const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { createUser } = require('./createUser');

const initializeUser = async () =>{
    const idempotencyKey = uuidv4();

    try{
        const response = await axios.post('http://localhost:5000/api/initialize_user',{
            idempotencyKey});
            
        console.log("Backend response:",response.data);
        console.log("idempotency key: ",idempotencyKey);
        return response.data.challengeId;
    }catch(error){
        console.error('Error in initializeUser:', error );
    }
}

module.exports = {initializeUser};