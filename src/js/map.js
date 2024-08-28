(function() {
    const lat = document.querySelector("#lat").value || -34.61628414519431
    const lng = document.querySelector("#lng").value || -58.539098883364865
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    const myIcon = L.icon({
        iconUrl: '/img/zoro-pin.png',
        iconSize: [60, 65],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    })

    const geocodeService = L.esri.Geocoding.geocodeService()
    console.log(geocodeService);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Agrega un pin marker al mapa
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
        icon: myIcon
    }).addTo(mapa)

    //Detecta el movimiento del pin
    marker.on("moveend", function(e){
        marker = e.target
        const position = marker.getLatLng()
        mapa.panTo(new L.LatLng(position.lat, position.lng))

        //Obtener calles al soltar pin
        geocodeService.reverse().latlng(position, 13).run(function(error, resultado) {
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)

            //coloca calle en los campos
            document.querySelector('.calle').textContent =resultado?.address?.LongLabel

            document.querySelector('#calle').value =resultado?.address?.LongLabel ?? ''
            document.querySelector('#lat').value =resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value =resultado?.latlng?.lng ?? ''
        })

    })
   
})()

//-34.61628414519431, -58.539098883364865

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//     async function (position) {
//     latitude = position.coords.latitude;
//     longitude = position.coords.longitude;
    
//       const mapa = L.map("mapa").setView([latitude, longitude], 16);
    
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(mapa);
//     },
//     function (error) {
//       switch (error.code) {
//         case error.PERMISSION_DENIED:
//           console.error("Permiso denegado para obtener la ubicación.");
//           break;
//         case error.POSITION_UNAVAILABLE:
//           console.error("La información de ubicación no está disponible.");
//           break;
//         case error.TIMEOUT:
//           console.error("La solicitud para obtener la ubicación ha caducado.");
//           break;
//         case error.UNKNOWN_ERROR:
//           console.error("Ha ocurrido un error desconocido.");
//           break;
//       }
//     }
    
//     );
//     } else {
//     console.error("Geolocalización no es soportada por este navegador.");
//     }
    