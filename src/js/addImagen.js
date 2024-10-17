import { Dropzone } from "dropzone";

const csrfToken = document.querySelector('meta[name="csrfToken"]').getAttribute("content")
Dropzone.options.myDropzone = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    headers: {
        'CSRF-Token': csrfToken
    },
    paramName: "imagen",
    init: function () {
        const dropzone = this
        const btnPublicar = document.getElementById("publicar")

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = 'mis-propiedades'
            }
        })
    }
}