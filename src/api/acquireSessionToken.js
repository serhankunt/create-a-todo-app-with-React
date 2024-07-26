// import axios from "axios";
// import { createUser } from "./createUser";

const { v4: uuidv4 } = require('uuid');
const axios = require('axios');


const acquireSessionToken = async () => {
    //const result = await createUser();
    const options = {
        method: "POST",
    url: "https://api.circle.com/v1/w3s/users/token",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    data: { userId: process.env.NEXT_PUBLIC_USER_ID }, //process.env.NEXT_PUBLIC_USER_ID 
    };

    try{
        const response = await axios.request(options);
        console.log("User token", response.data.data.userToken);
        console.log("Encryption key:",response.data.data.encryptionKey);
        return{
            userToken:response.data.data.userToken,
            encryptionKey:response.data.data.encryptionKey
        };
    }
    catch(error){
        console.error("Error acquiring session token:",error);
        return null;
    }
}

module.exports = {acquireSessionToken};