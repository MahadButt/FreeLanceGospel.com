import axios from "axios";
import { API_ROOT } from "./consts";

const instance = axios.create({ baseURL: `${API_ROOT}api` });

export default instance;