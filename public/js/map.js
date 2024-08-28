/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/map.js":
/*!***********************!*\
  !*** ./src/js/map.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n    const lat = document.querySelector(\"#lat\").value || -34.61628414519431\n    const lng = document.querySelector(\"#lng\").value || -58.539098883364865\n    const mapa = L.map('mapa').setView([lat, lng ], 16);\n    let marker;\n    const myIcon = L.icon({\n        iconUrl: '/img/zoro-pin.png',\n        iconSize: [60, 65],\n        iconAnchor: [22, 94],\n        popupAnchor: [-3, -76],\n        shadowSize: [68, 95],\n        shadowAnchor: [22, 94]\n    })\n\n    const geocodeService = L.esri.Geocoding.geocodeService()\n    console.log(geocodeService);\n\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    //Agrega un pin marker al mapa\n    marker = new L.marker([lat, lng], {\n        draggable: true,\n        autoPan: true,\n        icon: myIcon\n    }).addTo(mapa)\n\n    //Detecta el movimiento del pin\n    marker.on(\"moveend\", function(e){\n        marker = e.target\n        const position = marker.getLatLng()\n        mapa.panTo(new L.LatLng(position.lat, position.lng))\n\n        //Obtener calles al soltar pin\n        geocodeService.reverse().latlng(position, 13).run(function(error, resultado) {\n            console.log(resultado)\n            marker.bindPopup(resultado.address.LongLabel)\n\n            //coloca calle en los campos\n            document.querySelector('.calle').textContent =resultado?.address?.LongLabel\n\n            document.querySelector('#calle').value =resultado?.address?.LongLabel ?? ''\n            document.querySelector('#lat').value =resultado?.latlng?.lat ?? ''\n            document.querySelector('#lng').value =resultado?.latlng?.lng ?? ''\n        })\n\n    })\n   \n})()\n\n//-34.61628414519431, -58.539098883364865\n\n// if (navigator.geolocation) {\n//     navigator.geolocation.getCurrentPosition(\n//     async function (position) {\n//     latitude = position.coords.latitude;\n//     longitude = position.coords.longitude;\n    \n//       const mapa = L.map(\"mapa\").setView([latitude, longitude], 16);\n    \n//       L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\n//         attribution:\n//           '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n//       }).addTo(mapa);\n//     },\n//     function (error) {\n//       switch (error.code) {\n//         case error.PERMISSION_DENIED:\n//           console.error(\"Permiso denegado para obtener la ubicación.\");\n//           break;\n//         case error.POSITION_UNAVAILABLE:\n//           console.error(\"La información de ubicación no está disponible.\");\n//           break;\n//         case error.TIMEOUT:\n//           console.error(\"La solicitud para obtener la ubicación ha caducado.\");\n//           break;\n//         case error.UNKNOWN_ERROR:\n//           console.error(\"Ha ocurrido un error desconocido.\");\n//           break;\n//       }\n//     }\n    \n//     );\n//     } else {\n//     console.error(\"Geolocalización no es soportada por este navegador.\");\n//     }\n    \n\n//# sourceURL=webpack://bienesraices/./src/js/map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;