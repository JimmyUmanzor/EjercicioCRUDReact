import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const FormularioUsuario = ({ usuario, onCerrar, onExito }) => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [avatar, setAvatar] = useState(null)


  useEffect(() => {
    if (usuario) {
      setNombre(usuario.name)
      setEmail(usuario.email)
      setPassword(usuario.password)
      setRole(usuario.role)
      setAvatar(usuario.avatar)
    }
  }, [usuario])

  const manejarEnviar = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', nombre)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('role', role)
      if (avatar) {
        formData.append('avatar', avatar); 
      }

      if (usuario) {
        await axios.put(`https://api.escuelajs.co/api/v1/users/${usuario.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
          MySwal.fire({
          icon: 'success',
          title: 'Usuario Actualizado',
        });
      } else {
        await axios.post('https://api.escuelajs.co/api/v1/users/', formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        });
        MySwal.fire({
          icon: 'success',
          title: 'Usuario Creado',
        });
      }
      onCerrar();
      onExito();
    } catch {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el usuario',
      });
    }
  };

  const manejarArchivo = (e) => {
    setAvatar(e.target.files[0])
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{usuario ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
            <button type="button" class="btn-close" aria-label="Close" onClick={onCerrar}> 
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={manejarEnviar}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rol</label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="avatar">Avatar</label>
                <input
                  type="file"
                  className="form-control"
                  id="avatar"
                  onChange={manejarArchivo}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {usuario ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioUsuario
