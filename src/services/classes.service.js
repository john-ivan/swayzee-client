import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://swayzee-server-deploy-heroku.herokuapp.com/api/';

class ClassesService {
  getClasses(params) {
    return axios.get(`${API_URL}classes`, { params });
  }

  getClass(id) {
    return axios.get(`${API_URL}classes/${id}` , { headers: authHeader() });
  }
}

export default new ClassesService();