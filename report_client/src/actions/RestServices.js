// var rootComponent;
//
// export function initializeState( root){
//     console.log("Initializing rest services")
//     rootComponent = root;
// }

// export function receiveHealthCheck(json) {
//     rootComponent.udpdateHealthCheck( {healthCheck:json});
//     console.log("receiveSeamaUser - ", json.toString())
// }
//
// export function fetchHealthCheck() {
//     return fetch('/untapped/health-check', {credentials: 'include'})
//         .then(response => response.json())
//         .then(json => receiveHealthCheck(json))
//         .catch(function(error){
//             // This means the service isn't running.
//             console.log("fetchHealthCheck failed", error);
//             rootComponent.setState( {healthCheck:{server:"failed", database:"n/a" }});
//         });
// }

// export function receiveSeamaKiosks(json) {
//     var kiosk = json.kiosks;
//     rootComponent.setState( {seamaKiosk:kiosk});
//     console.log("receiveSeamaUser - ", kiosk)
// }
//
// export function fetchSeamaKiosks() {
//     return fetch('/untapped/kiosks', {credentials: 'include'})
//         .then(response => response.json())
//         .then(json => receiveSeamaKiosks(json))
//         .catch(function(error){
//             console.log("fetchSeamaKiosks failed", error);
//         });
// }

// export function receiveWaterQuality(json) {
//     rootComponent.updateWaterQualityState(json);
//     console.log("receiveSeamaWaterQuality - ", json)
// }
//
// export function fetchWaterQuality( params) {
//     var urlParms = queryParams(params);
//     var url = '/untapped/water-quality?' + urlParms;
//     return fetch(url, {credentials: 'include'})
//         .then(response => response.json())
//         .then(json => receiveWaterQuality(json))
//         .catch(function(error){
//             console.log("fetchWaterQuality failed", error);
//         });
// }
//
// function queryParams(params) {
//     return Object.keys(params)
//         .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
//         .join('&');
// }

// export function receiveLogin(json) {
//     rootComponent.updateLogin(json);
//     console.log("receiveLogin - ", json)
// }
//
// export function fetchUserRole(user, password) {
//     // Note user basic authentication for now
//     const encodedCredentials = new Buffer(user + ':' + password).toString('base64');
//     const authValue = "Basic "+ encodedCredentials;
//
//     return fetch('/untapped/login', {headers: new Headers({'Authorization':authValue})})
//         .then(response => response.json())
//         .then(json => receiveLogin(json))
//         .catch(function(error){
//             console.log("receiveLogin failed", error);
//             rootComponent.updateLogin({LogState: "NoService" });
//         });
// }
//
// export function clearLogin(){
//     rootComponent.updateLogin({LogState: "NotLoggedIn" });
// }
