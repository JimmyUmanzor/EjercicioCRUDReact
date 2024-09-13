import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FormularioUsuario from './FormularioUsuario'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const manejarEditar = (usuario) => {
    setUsuarioEditando(usuario)
    setMostrarFormulario(true)
  };


  const obtenerUsuarios = async () => {
    try {
      const respuesta = await axios.get('https://api.escuelajs.co/api/v1/users')
      setUsuarios(respuesta.data)
    } catch {
      console.log('Error al obtener lista de usuarios')
    }
  };

  const manejarEliminar = async (id) => {
    const resultado = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`https://api.escuelajs.co/api/v1/users/${id}`)
        MySwal.fire({
          icon: 'success',
          title: 'Usuario Eliminado',
        });
        obtenerUsuarios()
      } catch {
          MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario',
        })
      }
    }
  };


  const manejarCerrarFormulario = () => {
    setUsuarioEditando(null)
    setMostrarFormulario(false)
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Usuarios</h1>
      <button className="btn btn-primary mb-3" onClick={() => setMostrarFormulario(true)}>
      <i className="fa-solid fa-circle-plus" /> Agregar Usuario</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Avatar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.password}</td>
              <td>{usuario.role}</td>
              <td>
                {usuario.avatar ? (
                  <img
                    src={usuario.avatar}
                    alt={usuario.name}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  'Sin avatar para mostrar'
                )}
              </td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => manejarEditar(usuario)}>
                <i className='fa-solid fa-edit' />
                </button>
                <button className="btn btn-danger" onClick={() => manejarEliminar(usuario.id)}>
                <i className='fa-solid fa-trash' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mostrarFormulario && <FormularioUsuario usuario={usuarioEditando} onCerrar={manejarCerrarFormulario} onExito={obtenerUsuarios} />}
    </div>
  )
}

export default ListaUsuarios
