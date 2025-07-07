// const Historial = require('../models/historial');
// const Inventario = require('../models/inventario');
// const Usuario = require('../models/usuario');

// exports.registrarPrestamo = async (req, res) => {
//   try {
//     const { inventarioId, observaciones } = req.body;
//     const usuarioId = req.user._id; 

//     const item = await Inventario.findById(inventarioId);
//     if (!item) {
//       return res.status(404).json({ message: 'Material no encontrado' });
//     }

//     if (item.estado !== 'Disponible') {
//       return res.status(400).json({ message: 'Material no disponible para préstamo' });
//     }

//     const historial = new Historial({
//       inventarioId,
//       usuarioId,
//       observaciones,
//       estado: 'Ocupado'
//     });

//     await historial.save();

//     item.estado = 'Ocupado';
//     await item.save();

//     res.status(201).json({ message: 'Préstamo registrado con éxito', historial });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al registrar préstamo', error });
//   }
// };

// exports.registrarDevolucion = async (req, res) => {
//   try {
//     const { historialId } = req.params;

//     const historial = await Historial.findById(historialId);
//     if (!historial) {
//       return res.status(404).json({ message: 'Registro de historial no encontrado' });
//     }

//     if (historial.estado !== 'Ocupado') {
//       return res.status(400).json({ message: 'Este material ya fue devuelto' });
//     }

//     historial.estado = 'Disponible';
//     historial.fechaDevolucion = new Date();
//     await historial.save();

//     const item = await Inventario.findById(historial.inventarioId);
//     if (item) {
//       item.estado = 'Disponible';
//       await item.save();
//     }

//     res.status(200).json({ message: 'Devolución registrada con éxito', historial });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al registrar devolución', error });
//   }
// };

// exports.obtenerHistorial = async (req, res) => {
//   try {
//     const historial = await Historial.find()
//       .populate('usuarioId', 'name email')
//       .populate('inventarioId', 'name model nseries');
//     res.status(200).json(historial);
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener historial', error });
//   }
// };

// exports.historialPorUsuario = async (req, res) => {
//   try {
//     const { usuarioId } = req.params;
//     const historial = await Historial.find({ usuarioId })
//       .populate('inventarioId', 'name model nseries');
//     res.status(200).json(historial);
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener historial', error });
//   }
// };

// exports.historialPorMaterial = async (req, res) => {
//   try {
//     const { inventarioId } = req.params;
//     const historial = await Historial.find({ inventarioId })
//       .populate('usuarioId', 'name email tel');
//     res.status(200).json(historial);
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener historial', error });
//   }
// };

// exports.materialesEnUso = async (req, res) => {
//   try {
//     const prestamosActivos = await Historial.find({ estado: 'Ocupado' })
//       .populate('usuarioId', 'name email')
//       .populate('inventarioId', 'name model nseries');
//     res.status(200).json(prestamosActivos);
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener materiales en uso', error });
//   }
// };



const Historial = require('../models/historial');
const Inventario = require('../models/inventario');

const obtenerHoraActual = () => {
  const ahora = new Date();
  return ahora.toTimeString().slice(0, 5);
};

exports.registrarPrestamo = async (req, res) => {
  try {
    const { inventarioId, observaciones, horaSolicitud, horaDevolucion } = req.body; 
    const usuarioId = req.user._id;

    const item = await Inventario.findById(inventarioId);
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }

    if (item.estado !== 'Disponible') {
      return res.status(400).json({ message: 'Material no disponible para préstamo' });
    }

    const historial = new Historial({
      inventarioId,
      usuarioId,
      observaciones,
      estado: 'Ocupado',
      horaSolicitud: horaSolicitud || obtenerHoraActual(),
      horaDevolucion: horaDevolucion
    });

    await historial.save();

    item.estado = 'Ocupado';
    await item.save();

    res.status(201).json({ message: 'Préstamo registrado con éxito', historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar préstamo', error });
  }
};

exports.registrarDevolucion = async (req, res) => {
  try {
    const { historialId } = req.params;
    const { horaDevolucion } = req.body; 

    const historial = await Historial.findById(historialId);
    if (!historial) {
      return res.status(404).json({ message: 'Registro de historial no encontrado' });
    }

    if (historial.estado !== 'Ocupado') {
      return res.status(400).json({ message: 'Este material ya fue devuelto' });
    }

    historial.estado = 'Disponible';
    historial.fechaDevolucion = new Date();
    historial.horaDevolucion = horaDevolucion || obtenerHoraActual(); 

    await historial.save();

    const item = await Inventario.findById(historial.inventarioId);
    if (item) {
      item.estado = 'Disponible';
      await item.save();
    }

    res.status(200).json({ message: 'Devolución registrada con éxito', historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar devolución', error });
  }
};

exports.obtenerHistorial = async (req, res) => {
  try {
    const historial = await Historial.find()
      .populate('usuarioId', 'name email')
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error });
  }
};

exports.historialPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const historial = await Historial.find({ usuarioId })
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error });
  }
};

exports.historialPorMaterial = async (req, res) => {
  try {
    const { inventarioId } = req.params;
    const historial = await Historial.find({ inventarioId })
      .populate('usuarioId', 'name email tel');
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error });
  }
};

exports.materialesEnUso = async (req, res) => {
  try {
    const prestamosActivos = await Historial.find({ estado: 'Ocupado' })
      .populate('usuarioId', 'name email')
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(prestamosActivos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener materiales en uso', error });
  }
};
