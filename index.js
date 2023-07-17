const express = require('express');
const path = require('path');
const { obtenerDatosEmpleados, obtenerDatosDepartamentos, insertarEmpleado, insertarDepartamento } = require('./database');

const app = express();

// Para tener bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define las rutas
app.use(express.static(path.join(__dirname, 'public')));

// Define la ruta principal y la ruta empleado
app.get(['/', '/empleado'], (req, res) => {
    obtenerDatosEmpleados((errorEmpleados, datos_empleado) => {
        if (errorEmpleados) {
            // Manejo del error
            console.error(errorEmpleados);
            res.status(500).send('Error en el servidor');
        } else {
            obtenerDatosDepartamentos((errorDepartamentos, datos_departamento) => {
                if (errorDepartamentos) {
                    // Manejo del error
                    console.error(errorDepartamentos);
                    res.status(500).send('Error en el servidor');
                } else {
                    // Verifica que haya resultados antes de renderizar la vista
                    if (datos_empleado.length > 0 && datos_departamento.length > 0) {
                        res.render('empleado', { datos_empleado, datos_departamento }); // Pasar los datos al renderizar la plantilla
                    } else {
                        res.status(404).send('No se encontraron datos');
                    }
                }
            });
        }
    });
});

// Insertar empleado en la base datos
app.post('/empleado', (req, res) => {
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, departamento } = req.body;

    insertarEmpleado({ nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, departamento },
        (err) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                res.status(500).send('Error al procesar el formulario: ' + err.message);
            } else {
                res.status(200).send('Formulario enviado correctamente');
            }
        }
    );
});

// Obtener los datos de departamento
app.get('/departamento', (req, res) => {
    obtenerDatosDepartamentos((error, datos_departamento) => {
        if (error) {
            // Manejo del error
            console.error(error);
            res.status(500).send('Error en el servidor');
        } else {
            // Verifica que haya resultados antes de renderizar la vista
            if (datos_departamento.length > 0) {
                res.render('departamento', { datos_departamento });
            } else {
                res.status(404).send('No se encontraron datos');
            }
        }
    });
});

// Insertar departamento en la base datos
app.post('/departamento', (req, res) => {
    const { nombre } = req.body;

    insertarDepartamento(nombre, (err) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).send('Error al procesar el formulario: ' + err.message);
        } else {
            res.status(200).send('Formulario enviado correctamente');
        }
    });
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});