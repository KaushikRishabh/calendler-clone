// import { axiosToken } from "../utils/axios";
export async function GetAllEvents(url, token) {
  // debugger;
  try {
    const request = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: request.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
