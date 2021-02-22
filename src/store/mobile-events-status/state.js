export default {
  networkStatus: 'unknown', // Guarda el estado literal de la red, para saber como proceder cuando se inicia una tarea en segundo plano.
  applicationIsActive: true, // Esto creo que no es necesario, cuando se corre tarea en segundo plano se debería corroborar el estado de la red.
  storageStatus: 0 // Esto, si es verdadero, debería enviar los datos que quedaron en local para vaciar el almacenamiento local.
};
