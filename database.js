const { Pool } = require('pg');

// Configuración de postgresql
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'unidad3_practica3',
    password: 'yisus',
    port: 5432, // Puerto por defecto de PostgreSQL
});

// Manejo de eventos para verificar la conexión
pool.on('connect', () => {
    console.log('Conexión establecida a la base de datos');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

// Prueba de conexión
pool.query('SELECT NOW()', (error, result) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

// Obtener los datos de empleados
function obtenerDatosEmpleados(callback) {
    pool.query('SELECT * FROM empleado', (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results.rows);
        }
    });
}

// Obtener los datos de departamentos
function obtenerDatosDepartamentos(callback) {
    pool.query('SELECT * FROM departamento ORDER BY nombre ASC', (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results.rows);
        }
    });
}

// Insertar empleado en la base de datos
function insertarEmpleado(empleado, callback) {
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, departamento } = empleado;

    // Realiza la inserción en la base de datos
    pool.query('INSERT INTO empleado (nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, departamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, departamento], (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

// Insertar departamento en la base de datos
function insertarDepartamento(nombre, callback) {
    // Realiza la inserción en la base de datos
    pool.query('INSERT INTO departamento (nombre) VALUES ($1)', [nombre], (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports = {
    obtenerDatosEmpleados,
    obtenerDatosDepartamentos,
    insertarEmpleado,
    insertarDepartamento
};