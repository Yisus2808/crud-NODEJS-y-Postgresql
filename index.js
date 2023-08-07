const express = require('express');
const path = require('path');
const {
    pool,
    obtenerDatosEmpleados,
    obtenerDatosDepartamentos,
    insertarEmpleado,
    insertarDepartamento,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    eliminarEmpleado,
    obtenerDepartamentoPorId,
    actualizarDepartamento,
    eliminarDepartamento
} = require('./database');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
#######################################################
########### RUTAS PARA SERVIR LOS DIRECTORIOS
########### VIEWS, JS, CSS
#######################################################
*/
// Configuración de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo script.js
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Ruta para servir el archivo styles.css
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

/*
#######################################################
########### RUTAS DE LA APLICACIÓN
#######################################################
*/

// Ruta principal y ruta empleado
app.get(['/', '/empleado'], async(req, res, next) => {
    try {
        // Obtener los datos de los empleados y departamentos
        const datosEmpleados = await obtenerDatosEmpleados();
        const datosDepartamentos = await obtenerDatosDepartamentos();

        // Aquí defines el valor de las variables isEditing y currentEditingRowId
        const isEditing = false; // O cualquier otro valor que corresponda a tu lógica
        const currentEditingRowId = null; // O cualquier otro valor que corresponda a tu lógica

        // Renderizar la vista empleado con los datos obtenidos y las variables de edición
        res.render('empleado', {
            datos_empleado: datosEmpleados,
            datos_departamento: datosDepartamentos,
            isEditing: isEditing,
            currentEditingRowId: currentEditingRowId
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        next(error); // Pasar el error al siguiente middleware de manejo de errores
    }
});


// Insertar empleado en la base de datos
app.post('/empleado', async(req, res, next) => {
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento } = req.body;

    try {
        // Validar datos de entrada
        if (!nombre) {
            return res.status(400).send('El nombre es obligatorio');
        }

        // Verificar que el valor del departamento no sea nulo
        if (id_departamento === null || id_departamento === undefined) {
            return res.status(400).send('Debe seleccionar un departamento');
        }

        // Convertir el valor del campo "id_departamento" a un número entero
        const idDepartamento = parseInt(id_departamento, 10);

        // Verificar si el valor es un número válido
        if (isNaN(idDepartamento)) {
            return res.status(400).send('El ID del departamento debe ser un número válido');
        }

        // Insertar empleado en la base de datos
        await insertarEmpleado({ nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento: idDepartamento });
        res.status(200).send('Empleado insertado correctamente');
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        next(error); // Pasar el error al siguiente middleware de manejo de errores
    }
});

// Actualizar empleado en la base de datos
app.put('/empleado/:id', async(req, res) => {
    const empleadoId = req.params.id;
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento } = req.body;

    try {
        // Verificar si el empleado existe antes de actualizar
        const empleadoExistente = await obtenerEmpleadoPorId(empleadoId);
        if (!empleadoExistente) {
            return res.status(404).send('Empleado no encontrado');
        }

        // Actualizar empleado en la base de datos
        await actualizarEmpleado(empleadoId, {
            nombre,
            apellido,
            telefono,
            direccion,
            fecha_nacimiento,
            observaciones,
            sueldo,
            id_departamento,
        });

        // Obtener los datos actualizados del empleado
        const empleadoActualizado = await obtenerEmpleadoPorId(empleadoId);

        // Enviar los datos actualizados del empleado como respuesta en formato JSON
        res.status(200).json(empleadoActualizado);
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        next(error);
    }
});


// Eliminar empleado de la base de datos
app.delete('/empleado/:id', async(req, res) => {
    const empleadoId = req.params.id;

    try {
        // Verificar si el empleado existe antes de eliminar
        const empleadoExistente = await obtenerEmpleadoPorId(empleadoId);
        if (!empleadoExistente) {
            return res.status(404).send('Empleado no encontrado');
        }

        // Eliminar empleado de la base de datos
        await eliminarEmpleado(empleadoId);

        res.status(200).send('Empleado eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        next(error);
    }
});

// Obtener los datos de los departamentos
app.get('/departamento', async(req, res) => {
    try {
        // Obtener los datos de los departamentos
        const datosDepartamentos = await obtenerDatosDepartamentos();

        // Renderizar la vista departamento con los datos obtenidos
        res.render('departamento', { datos_departamento: datosDepartamentos });
    } catch (error) {
        console.error('Error en el servidor:', error);
        next(error);
    }
});

// Insertar departamento en la base de datos
app.post('/departamento', async(req, res) => {
    const { nombre } = req.body;

    try {
        // Insertar departamento en la base de datos
        await insertarDepartamento(nombre);
        res.status(200).send('Formulario enviado correctamente');
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        next(error);
    }
});

// Actualizar departamento en la base de datos
app.put('/departamento/:id', async(req, res) => {
    const departamentoId = req.params.id;
    const { nombre } = req.body;

    try {
        // Verificar si el departamento existe antes de actualizar
        const departamentoExistente = await obtenerDepartamentoPorId(departamentoId);
        if (!departamentoExistente) {
            return res.status(404).send('Departamento no encontrado');
        }

        // Actualizar departamento en la base de datos
        await actualizarDepartamento(departamentoId, nombre);
        res.status(200).json({ message: 'Departamento actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar departamento:', error);
        next(error);
    }
});

// Eliminar departamento de la base de datos
app.delete('/departamento/:id', async(req, res) => {
    const departamentoId = req.params.id;

    try {
        // Verificar si el departamento existe antes de eliminar
        const departamentoExistente = await obtenerDepartamentoPorId(departamentoId);
        if (!departamentoExistente) {
            return res.status(404).send('Departamento no encontrado');
        }

        // Eliminar departamento de la base de datos
        await eliminarDepartamento(departamentoId);

        res.status(200).send('Departamento eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar departamento:', error);
        next(error);
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);

    // Verificar si el error es un error de la base de datos
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ECONNRESET') {
        console.error('Error en la conexión a la base de datos:', err.message);
        res.status(500).send('Error en la conexión a la base de datos');
    } else {
        // Otro tipo de error que no sea de la base de datos
        console.error('Error interno del servidor:', err);
        res.status(500).send('Error interno del servidor');
    }
});



// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});