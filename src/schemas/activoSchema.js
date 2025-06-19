const { object, string, optional } = require('valibot');

const activoSchema = object({
  tipo: string(),
  marca: string(),
  modelo: string(),
  estado: string(),
  ubicacion: string(),
  numeroSerie: string(),
  fechaAdquisicion: string(),
  personalId: optional(string()) // Campo opcional para cuando el estado es 'Asignado'
});

module.exports = activoSchema;