const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const createUser = async () => {
  const userId = uuidv4();

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/users",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    data: { userId: userId },
  };

  try {
    const response = await axios.request(options);
    if (response.status === 201) {
      console.log("User ID: ",userId);
      return { userId, status: response.status };
    } else {
      console.error("User creation failed. Status:", response);
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
};

module.exports = { createUser };
