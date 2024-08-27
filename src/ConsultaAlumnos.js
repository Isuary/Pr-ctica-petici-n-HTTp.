import React, { useState } from 'react';

const ConsultaAlumnos = () => {
  const [carnet, setCarnet] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [seccion, setSeccion] = useState('');
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    if (carnet.trim() === '') {
      setError('Por favor, ingrese el número de carnet.');
      return;
    }

    try {
      const response = await fetch(`/estudiantes/${encodeURIComponent(carnet.trim())}`);
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        if (response.ok && data.Alumnos && data.Alumnos.length > 0) {
          const estudiante = data.Alumnos[0];
          setNombre(estudiante.Estudiante);
          setCorreo(estudiante.Email);
          setSeccion(estudiante.Seccion);
          setError('');
        } else {
          setError('Estudiante no encontrado');
        }
      } else {
        setError('La respuesta no es un JSON válido.');
        console.log('Respuesta de la API (no JSON):', await response.text());
      }
    } catch (error) {
      console.error('Error al conectarse con la API:', error);
      setError('Error al conectarse con la API.');
    }
  };

  const handleLimpiar = () => {
    setCarnet('');
    setNombre('');
    setCorreo('');
    setSeccion('');
    setError('');
  };

  const handleCancelar = () => {
    handleLimpiar();
  };

  return (
    <div>
      <h1>Consulta de Alumnos</h1>
      <div>
        <label>Carnet:</label>
        <input
          type="text"
          value={carnet}
          onChange={(e) => setCarnet(e.target.value)}
          placeholder="Ingrese el carnet"
        />
      </div>
      <div>
        <label>Nombres:</label>
        <input type="text" value={nombre} readOnly />
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input type="text" value={correo} readOnly />
      </div>
      <div>
        <label>Sección:</label>
        <input type="text" value={seccion} readOnly />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleLimpiar}>Limpiar</button>
        <button onClick={handleCancelar}>Cancelar</button>
      </div>
    </div>
  );
};

export default ConsultaAlumnos;
