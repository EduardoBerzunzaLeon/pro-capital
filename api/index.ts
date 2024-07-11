import axios from "axios";
// import { METHOD } from "types/methods";

export type LoginPayload = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};



const Api = class Api {
  baseURL: string;
  token: string | undefined;
  constructor() {
    this.baseURL = process.env.API_BASE_URL as string;
    this.token = "";
  }

  initializeInstance = () => {
    const baseURL = this.baseURL;
    console.log(baseURL);

    const instance = axios.create({
      baseURL,
      withCredentials: false,
    });

    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.log(error);

        return Promise.reject(error);
      }
    );

    return instance;
  };

  publicRequest = <T>(url: string, method: string, data: T) => {
    const instance = this.initializeInstance();
    return instance({
      url,
      method,
      data,
    });
  };

  loginUser = (payload: LoginPayload) => {
    const url = "/login";
    return this.publicRequest(url, 'post', payload);
  };
};

export default Api;