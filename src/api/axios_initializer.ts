import Axios from 'axios';

export default function initializeAxios(): void {
    Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL; // TODO make this environment-configurable.
    // Configure Axios to deal with CSRF tokens for us.
    // Axios.defaults.xsrfCookieName = 'X-CSRF-Token'; // TODO add back and remove the manual stuff for this in apiRequest.ts
    // Axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
    /* `withCredentials` indicates whether or not cross-site Access-Control requests
        should be made using credentials */
    Axios.defaults.withCredentials = true;
}
