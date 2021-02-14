export default {
  networkStatus: null, // Guarda el estado literal de la red, para saber como proceder cuando se inicia una tarea en segundo plano.
  applicationStatus: "active", // Esto creo que no es necesario, cuando se corre tarea en segundo plano se debería corroborar el estado de la red.
  storageStatus: null // Esto, si es verdadero, debería enviar los datos que quedaron en local para vaciar el almacenamiento local.
};
