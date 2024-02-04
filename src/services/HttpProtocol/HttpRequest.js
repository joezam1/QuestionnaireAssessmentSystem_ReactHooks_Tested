
import MonitorService from '../monitoring/MonitoringService.js'
import JSonInspector from "../validators/JSonInspector.js";



//Test: DONE
function fetchMethod(url, options, responseCallback) {
    fetch(url, options)
        .then(function (response) {
            MonitorService.capture('response:', response);
            return response.text();
        })
        .then(function (result) {
            MonitorService.capture('result:', result);
            var responseObj = JSonInspector.safeJsonParse(result);
            MonitorService.capture('responseObj:', responseObj);

            responseCallback(responseObj);

        })
        .catch(function (error) {
            var errorObj = new Error("Promise Error:" + error);
            MonitorService.capture(errorObj);
        })
}

let service = Object.freeze({
    fetchMethod:fetchMethod
});
export default service;