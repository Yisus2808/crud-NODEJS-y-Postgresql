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

/*########################
CONSULTAS DE EMPLEADOS
###############################*/

// Obtener los datos de empleados
// Obtener los datos de empleados
async function obtenerDatosEmpleados() {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM empleado';
        const result = await client.query(query);
        client.release();
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Insertar empleado en la base de datos
async function insertarEmpleado(empleado) {
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento } = empleado;

    try {
        // Realiza la inserción en la base de datos
        await pool.query(
            'INSERT INTO empleado (nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento]
        );
    } catch (error) {
        throw error;
    }
}



// Obtener un empleado por su ID
async function obtenerEmpleadoPorId(id) {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM empleado WHERE id_empleado = $1';
        const values = [id];
        const result = await client.query(query, values);
        client.release();
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Actualizar empleado en la base de datos
async function actualizarEmpleado(id, datosEmpleado) {
    const { nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento } = datosEmpleado;

    try {
        const client = await pool.connect();
        const query =
            'UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, direccion = $4, fecha_nacimiento = $5, observaciones = $6, sueldo = $7, id_departamento = $8 WHERE id_empleado = $9';
        const values = [nombre, apellido, telefono, direccion, fecha_nacimiento, observaciones, sueldo, id_departamento, id];
        await client.query(query, values);
        client.release();
    } catch (error) {
        throw error;
    }
}


// Eliminar empleado de la base de datos
async function eliminarEmpleado(id) {
    try {
        const client = await pool.connect();
        const query = 'DELETE FROM empleado WHERE id_empleado = $1';
        const values = [id];
        await client.query(query, values);
        client.release();
    } catch (error) {
        throw error;
    }
}

/*########################
CONSULTAS DE DEPARTAMENTOS
###############################*/

// Obtener los datos de departamentos
async function obtenerDatosDepartamentos() {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM departamento ORDER BY nombre ASC';
        const result = await client.query(query);
        client.release();
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Insertar departamento
async function insertarDepartamento(nombre) {
    try {
        // Realiza la inserción en la base de datos
        await pool.query('INSERT INTO departamento (nombre) VALUES ($1)', [nombre]);
    } catch (error) {
        throw error;
    }
}

// Obtener un departamento por su ID
async function obtenerDepartamentoPorId(id) {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM departamento WHERE id_departamento = $1';
        const values = [id];
        const result = await client.query(query, values);
        client.release();
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Actualizar departamento en la base de datos
async function actualizarDepartamento(id, nombre) {
    try {
        const client = await pool.connect();
        const query = 'UPDATE departamento SET nombre = $1 WHERE id_departamento = $2';
        const values = [nombre, id];
        await client.query(query, values);
        client.release();
    } catch (error) {
        throw error;
    }
}

// Eliminar departamento de la base de datos
async function eliminarDepartamento(id) {
    try {
        const client = await pool.connect();
        const query = 'DELETE FROM departamento WHERE id_departamento = $1';
        const values = [id];
        await client.query(query, values);
        client.release();
    } catch (error) {
        throw error;
    }
}

module.exports = {
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
};