const Inventario = require('../models/inventario');
const upload = require('../../config/multerConfig');


const Estados = ['Disponible', 'Ocupado', 'En Mantenimiento'];


exports.registrarEquipoConImagenes = async (req, res) => {
    try {
        const { name, model, description, categoria, nseries,estado } = req.body;
        const files = req.files;

        const equipoExistente = await Inventario.findOne({ nseries });
        if (equipoExistente) {
            return res.status(400).json({ message: 'El equipo ya está registrado' });
        }

        const imagenes = files.map(file => ({
            url: `http://localhost:3001/uploads/${file.filename}`
        }));

        const nuevoEquipo = new Inventario({
            name,
            model,
            description,
            categoria,
            nseries,
            estado,
            imagenes: imagenes, 
        });

        await nuevoEquipo.save();

        res.status(201).json({
            message: 'Equipo registrado exitosamente con imágenes',
            equipo: nuevoEquipo
        });

    } catch (error) {
        console.error('Error al registrar el equipo:', error);
        res.status(500).json({ message: 'Error al registrar el equipo', error });
    }
};

exports.obtenerEquipos = async (req, res) => {
    try {
        const equipos = await Inventario.find();
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los equipos', error });
    }
};

exports.obtenerEquipoPorId = async (req, res) => {
  try {
    const equipo = await Inventario.findById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el equipo' });
  }
};


exports.actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const equipoActualizado = await Inventario.findByIdAndUpdate(id, req.body, { new: true });
        if (!equipoActualizado) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.status(200).json({ message: 'Equipo actualizado', equipo: equipoActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el equipo', error });
    }
};

exports.eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Inventario.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.status(200).json({ message: 'Equipo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el equipo', error });
    }
};

exports.actualizarEstadoPorQR = async (req, res) => {
    try {
        const { codigoQR } = req.params;

        const equipo = await Inventario.findOne({ codigoQR });
        if (!equipo) return res.status(404).json({ message: 'Equipo no encontrado por QR' });

        const nuevoEstado = equipo.Estado === 'Disponible' ? 'Ocupado' : 'Disponible';

        equipo.Estado = nuevoEstado;
        await equipo.save();

        res.status(200).json({ message: `Estado cambiado a ${Estados[nuevoEstado]}`, equipo });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado por QR', error });
    }
};

exports.obtenerPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const equipos = await Inventario.find({ categoria });
        if (!equipos) return res.status(404).json({ message: 'categoria no encontrada' });
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener equipos por categoría', error });
    }
};

exports.obtenerPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const estadoIndex = Estados.indexOf(estado);
        if (estadoIndex < 0 || estadoIndex > 2) return res.status(400).json({ message: 'Estado inválido' });

        const equipos = await Inventario.find({ Estados: estadoIndex });
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener equipos por estado', error });
    }
};

