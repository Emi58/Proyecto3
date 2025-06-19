const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/crypto');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    // Crear departamentos
    const departamentos = [
      'Depto Contabilidad',
      'Depto Facturación',
      'Depto Informatica',
      'Depto Tesoreria',
      'Depto Programas Medicos',
      'Depto Gestion de Personas',
      'Laboratorio',
      'Medico Quirurgico',
      'Depto Convenios y Operaciones Comerciales',
      'Depto Comunicación y Marketing',
      'Consultas Medicas'
    ];

    for (const nombre of departamentos) {
      await prisma.departamento.create({
        data: { nombre }
      });
    }

    // Crear personal
    const personal = [
      { nombre: 'Camila', apellidoPaterno: 'Hernández', apellidoMaterno: 'Soto', rut: '11.234.567-8', ubicacion: 'Torre 120Años P1' },
      { nombre: 'Tomás', apellidoPaterno: 'Rivas', apellidoMaterno: 'Ortega', rut: '12.987.654-1', ubicacion: 'Clínica Mujer P2' },
      { nombre: 'Fernanda', apellidoPaterno: 'Alarcón', apellidoMaterno: 'Díaz', rut: '13.456.789-0', ubicacion: 'Torre Jungue P1' },
      { nombre: 'Diego', apellidoPaterno: 'Contreras', apellidoMaterno: 'Ruiz', rut: '14.321.123-3', ubicacion: 'Bodega Informática' },
      { nombre: 'Valentina', apellidoPaterno: 'Pérez', apellidoMaterno: 'Figueroa', rut: '15.789.654-4', ubicacion: 'Torre 120Años P2' },
      { nombre: 'Rodrigo', apellidoPaterno: 'Sepúlveda', apellidoMaterno: 'León', rut: '16.159.753-2', ubicacion: 'Torre 120Años P3' },
      { nombre: 'Javiera', apellidoPaterno: 'Moya', apellidoMaterno: 'Castillo', rut: '17.852.963-1', ubicacion: 'Clínica Mujer P1' },
      { nombre: 'Felipe', apellidoPaterno: 'Gutiérrez', apellidoMaterno: 'Ríos', rut: '18.321.456-7', ubicacion: 'Torre Jungue P2' },
      { nombre: 'Paula', apellidoPaterno: 'Soto', apellidoMaterno: 'Araya', rut: '19.654.123-0', ubicacion: 'Torre 120Años P2' },
      { nombre: 'Esteban', apellidoPaterno: 'Molina', apellidoMaterno: 'Vera', rut: '20.852.147-6', ubicacion: 'Torre Jungue P1' },
      { nombre: 'Catalina', apellidoPaterno: 'Bravo', apellidoMaterno: 'Torres', rut: '21.963.741-5', ubicacion: 'Clínica Mujer P1' },
      { nombre: 'Benjamín', apellidoPaterno: 'Araya', apellidoMaterno: 'Gómez', rut: '22.147.258-3', ubicacion: 'Torre 120Años P1' },
      { nombre: 'Isidora', apellidoPaterno: 'Fuentes', apellidoMaterno: 'Palma', rut: '23.258.369-4', ubicacion: 'Clínica Mujer P2' },
      { nombre: 'Ignacio', apellidoPaterno: 'Valdés', apellidoMaterno: 'Ramírez', rut: '24.369.147-9', ubicacion: 'Torre Jungue P2' },
      { nombre: 'Constanza', apellidoPaterno: 'Reyes', apellidoMaterno: 'Silva', rut: '25.471.258-1', ubicacion: 'Bodega Informática' },
      { nombre: 'Martín', apellidoPaterno: 'Leiva', apellidoMaterno: 'Herrera', rut: '26.582.369-6', ubicacion: 'Torre 120Años P3' },
      { nombre: 'Antonia', apellidoPaterno: 'Campos', apellidoMaterno: 'Rojas', rut: '27.693.741-0', ubicacion: 'Torre 120Años P2' },
      { nombre: 'Lucas', apellidoPaterno: 'Espinoza', apellidoMaterno: 'Peña', rut: '28.714.852-5', ubicacion: 'Clínica Mujer P1' },
      { nombre: 'Emilia', apellidoPaterno: 'Torres', apellidoMaterno: 'Paredes', rut: '29.825.963-8', ubicacion: 'Torre Jungue P1' },
      { nombre: 'Nicolás', apellidoPaterno: 'Saavedra', apellidoMaterno: 'Muñoz', rut: '30.936.147-7', ubicacion: 'Torre 120Años P1' }
    ];

    const deptInformatica = await prisma.departamento.findFirst({
      where: { nombre: 'Depto Informatica' }
    });

    if (!deptInformatica) {
      throw new Error('Departamento de Informática no encontrado');
    }

    for (const p of personal) {
      try {
        await prisma.personal.create({
          data: {
            rut: p.rut,
            nombre: p.nombre,
            apellidoPaterno: p.apellidoPaterno,
            apellidoMaterno: p.apellidoMaterno,
            departamentoId: deptInformatica.id
            // Remueve campo ubicacion ya que no existe en el modelo
          }
        });
        console.log(`Personal creado: ${p.nombre} ${p.apellidoPaterno}`);
      } catch (error) {
        console.error(`Error al crear personal ${p.rut}:`, error);
      }
    }

    // Crear usuarios administrador y técnico 
    const admin = await prisma.usuario.create({
      data: {
        username: 'admin',
        password: hashPassword('Prueba.1A2B'),
        nombre: 'Administrador',
        isAdmin: true,
        descripcion: 'Usuario administrador con todos los permisos'
      }
    });

    await prisma.usuario.create({
      data: {
        username: 'tecTI',
        password: hashPassword('tecnico_2B1A'),
        nombre: 'Técnico TI',
        isAdmin: false,
        descripcion: 'Usuario técnico con permisos generales'
      }
    });

    // Crear activos
    const activos = [
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T430', numeroSerie: 'SPB4ALRW', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T440p', numeroSerie: 'PB00WBVZ', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T440p', numeroSerie: 'PC06LM1B', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T460', numeroSerie: 'PC0GW2JN', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T470', numeroSerie: 'PF0R5VGE', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T470', numeroSerie: 'PF0R5ZB8', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Notebook', marca: 'Lenovo', modelo: 'T470', numeroSerie: 'PF0R5ZBQ', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'M92p', numeroSerie: 'MJYRLLZ', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'M93p', numeroSerie: 'MJ008N2H', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'M93p', numeroSerie: 'MJ009E4Z', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'Tiny M73', numeroSerie: 'MJ02B4T9', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'Tiny M73', numeroSerie: 'MJ02B96R', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'Tiny M73', numeroSerie: 'MJ02B4T1', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'Tiny M93p', numeroSerie: 'MJ02U8EL', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'CPU', marca: 'Lenovo', modelo: 'Tiny M93p', numeroSerie: 'MJ02U8FS', estado: 'Baja', ubicacion: 'BODEGA-INFORMATICA' },
      { tipo: 'Monitor', marca: 'HP', modelo: 'P204', numeroSerie: '3CQ9360MHH', estado: 'Baja', ubicacion: 'BODEGA-INFORMATICA' },
      { tipo: 'Monitor', marca: 'Samsung', modelo: 'S19c', numeroSerie: 'ZYGNH4LF105577M', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'Samsung', modelo: 'S19a', numeroSerie: 'ZTN6H4LD402567Y', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'Lenovo', modelo: 'LS192wa', numeroSerie: 'V3L9086', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'Lenovo', modelo: 'LS192WS', numeroSerie: '803UXMT1F563', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'LG', modelo: 'L192WS', numeroSerie: '803UXPH1M240', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'LG', modelo: 'L192WS', numeroSerie: '803UXEZ1F564', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Monitor', marca: 'LG', modelo: 'L192WS', numeroSerie: '803UXGL1G015', estado: 'Baja', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Modem', marca: 'Huawei', modelo: 'E5576-508', numeroSerie: '866688042562301', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' },
      { tipo: 'Modem', marca: 'Huawei', modelo: 'E5576-508', numeroSerie: '866688041781613', estado: 'Malo', ubicacion: 'BODEGA INFORMATICA' }
    ];

    const primerPersonal = await prisma.personal.findFirst();
    const fechaAdquisicion = new Date('2024-05-20');

    for (const activo of activos) {
      try {
        await prisma.activo.create({
          data: {
            tipo: activo.tipo,
            marca: activo.marca,
            modelo: activo.modelo,
            estado: activo.estado,
            ubicacion: activo.ubicacion.replace('-', ' '), // Unificar formato de ubicación
            numeroSerie: activo.numeroSerie,
            fechaAdquisicion: fechaAdquisicion,
            asignaciones: {
              create: {
                fechaAsignacion: new Date(),
                responsable: 'Sin asignar',
                usuarioId: admin.id,
                departamentoId: deptInformatica.id,
                personalId: primerPersonal.id
              }
            }
          }
        });
        console.log(`Activo creado: ${activo.tipo} - ${activo.numeroSerie}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Error de duplicación para el activo ${activo.numeroSerie}: ${error.message}`);
        } else {
          console.error(`Error al crear activo ${activo.numeroSerie}:`, error);
        }
      }
    }

    console.log('Base de datos inicializada exitosamente');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Algunos registros ya existen en la base de datos');
    } else {
      console.error('Error al inicializar la base de datos:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();