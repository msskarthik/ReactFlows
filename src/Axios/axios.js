import axios from "axios";

const instance = axios.create({
  baseURL: "https://productflowapi.easyfastnow.com/",
  timeout: 10000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;