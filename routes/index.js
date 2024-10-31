
import Health from "./healthRoutes.js";
const BASE_PATH = '/api/v1';

export default (app) =>{
    app.use(`${BASE_PATH}`, Health);
}