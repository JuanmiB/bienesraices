// Funcion para generar un token unico
export const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)