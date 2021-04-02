import Axios from 'axios';
import config from '../config';

export default function initializeAxios(): void {
    Axios.defaults.baseURL = config.REACT_APP_API_BASE_URL;
    // Configure Axios to deal with CSRF tokens for us.
    Axios.defaults.xsrfCookieName = 'X-CSRF-Token';
    Axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
    Axios.defaults.headers['Content-Type'] = 'application/json';
    /* `withCredentials` indicates whether or not cross-site Access-Control requests
        should be made using credentials */
    Axios.defaults.withCredentials = true;
}
