import axios from 'axios';
import CONSTANTS from '../constants';
export const register = async (data) => {
    const response = await axios.post(CONSTANTS.ENDPOINT.REGISTER, data);
    return response;
}