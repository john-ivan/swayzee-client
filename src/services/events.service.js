import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://swayzee-server-deploy-heroku.herokuapp.com/api/';

class EventsService {
  postEvents(events) {
    return axios.post(`${API_URL}events`, events, {
      headers: authHeader()
    });
  }
}

export default new EventsService();