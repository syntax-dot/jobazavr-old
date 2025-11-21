import axios from 'axios';

const internalAPIRequest = async (url: string, method: string, data = null) => {
  try {
    const req = await axios({
      url: `https://vk-mini-app.jobazavr.ru/internal/${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      },
    });

    return req.data.data;
  } catch (e) {
    console.log(e);
  }

  return null;
};

export default internalAPIRequest;
