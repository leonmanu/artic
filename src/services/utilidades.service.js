const convertToJson = async (registros) => {
    // Agregar getter/setter dinámicos para cada encabezado
    const registrosJson = registros.map((row) => {
        const obj = {};
        const encabezados = row._worksheet._headerValues;

        // Agregar propiedades dinámicas basadas en los encabezados
        encabezados.forEach((header, index) => {
            Object.defineProperty(obj, header, {
                get: () => row._rawData[index] || null, // Getter para el valor
                set: (value) => { row._rawData[index] = value; }, // Setter para el valor
                enumerable: true, // Para que sea visible al recorrer el objeto
            });
        });

        // Agregar el rowNumber como propiedad adicional
        Object.defineProperty(obj, 'rowNumber', {
            value: row.rowNumber, // rowNumber está disponible en los registros
            writable: false, // Hacer que sea de solo lectura
            enumerable: true, // Hacerlo visible al recorrer el objeto
        });

        return obj;
    });

    return registrosJson;
};

module.exports = {
    convertToJson,
};
