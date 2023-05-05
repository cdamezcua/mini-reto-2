import Layout from "../components/layout/layout";
import s from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { Modal } from "../components/ui/modal/modal";
import axios from "axios";

export default function Home() {
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [tareasCompletas, setTareasCompletas] = useState([]);
  const [selectedPendientes, setSelectedPendientes] = useState([]);
  const [selectedCompletas, setSelectedCompletas] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const editTarea = (id) => {
    setEditId(id);
    setOpenEdit(true);
  };

  const handleEdit = () => {
    axios
      .put(`https://mini-reto-delta.vercel.app/tareas/${editId}`, {
        id: editId,
        titulo,
        descripcion,
        completada: false,
      })
      .then((response) => {
        const index = tareasPendientes.findIndex(
          (tarea) => tarea.id === editId
        );
        const updatedTarea = {
          ...tareasPendientes[index],
          titulo,
          descripcion,
        };
        const updatedTareas = [
          ...tareasPendientes.slice(0, index),
          updatedTarea,
          ...tareasPendientes.slice(index + 1),
        ];
        setTareasPendientes(updatedTareas);
        setEditId(1);
        setOpenEdit(false);
      })
      .catch((error) => console.error(error));
  };

  const borrarPendientes = () => {
    tareasPendientes.forEach((tarea) => {
      if (selectedPendientes.includes(tarea.id)) {
        axios
          .delete(`https://mini-reto-delta.vercel.app/tareas/${tarea.id}`)
          .then(() => {
            setTareasPendientes((prevTareas) =>
              prevTareas.filter((t) => t.id !== tarea.id)
            );
          })
          .catch((error) => console.error(error));
      }
    });
    setSelectedPendientes([]);
  };

  const borrarCompetas = () => {
    tareasCompletas.forEach((tarea) => {
      if (selectedCompletas.includes(tarea.id)) {
        axios
          .delete(`https://mini-reto-delta.vercel.app/tareas/${tarea.id}`)
          .then(() => {
            setTareasCompletas((prevTareas) =>
              prevTareas.filter((t) => t.id !== tarea.id)
            );
          })
          .catch((error) => console.error(error));
      }
    });
    setSelectedCompletas([]);
  };

  const marcarCompletadas = () => {
    tareasPendientes.forEach((tarea) => {
      if (selectedPendientes.includes(tarea.id)) {
        axios
          .put(`https://mini-reto-delta.vercel.app/tareas/${tarea.id}`, {
            id: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            completada: true,
          })
          .then((response) => {
            const tareaCompletada = tareasPendientes.find(
              (t) => t.id === tarea.id
            );
            setTareasPendientes((prevState) =>
              prevState.filter((t) => t.id !== tarea.id)
            );
            setTareasCompletas((prevState) => [...prevState, tareaCompletada]);
          })
          .catch((error) => console.error(error));
      }
    });
    setSelectedPendientes([]);
  };

  const crearTarea = () => {
    const nextId = Math.max(...tareasPendientes.map((tarea) => tarea.id)) + 1;
    axios
      .post("https://mini-reto-delta.vercel.app/tareas", {
        id: nextId,
        titulo,
        descripcion,
        completada: false,
      })
      .then((response) => {
        const nuevaTarea = {
          id: nextId,
          titulo,
          descripcion,
          completada: false,
        };
        setTareasPendientes([...tareasPendientes, nuevaTarea]);
        console.log(response);
      })

      .catch((error) => console.error(error));
    setOpenCreate(false);
  };

  const togglePendientes = (taskId) => {
    setSelectedPendientes((prevSelected) => {
      // Check if task already exists in selectedPendientes
      const taskIndex = prevSelected.indexOf(taskId);
      if (taskIndex === -1) {
        // Add task to selectedPendientes
        return [...prevSelected, taskId];
      } else {
        // Remove task from selectedPendientes
        const newSelected = [...prevSelected];
        newSelected.splice(taskIndex, 1);
        return newSelected;
      }
    });
    console.log(selectedPendientes.length);
  };

  const toggleCompletas = (taskId) => {
    setSelectedCompletas((prevSelected) => {
      // Check if task already exists in selectedPendientes
      const taskIndex = prevSelected.indexOf(taskId);
      if (taskIndex === -1) {
        // Add task to selectedPendientes
        return [...prevSelected, taskId];
      } else {
        // Remove task from selectedPendientes
        const newSelected = [...prevSelected];
        newSelected.splice(taskIndex, 1);
        return newSelected;
      }
    });
  };

  const borrarTarea = (id) => {
    axios
      .delete(`https://mini-reto-delta.vercel.app/tareas/${id}`)
      .then(() => {
        setTareasPendientes((prevTareas) =>
          prevTareas.filter((tarea) => tarea.id !== id)
        );
        setTareasCompletas((prevTareas) =>
          prevTareas.filter((tarea) => tarea.id !== id)
        );
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    axios
      .get("https://mini-reto-delta.vercel.app/tareas/pendientes")
      .then((response) => setTareasPendientes(response.data))
      .catch((error) => console.error(error));

    axios
      .get("https://mini-reto-delta.vercel.app/tareas/completadas")
      .then((response) => setTareasCompletas(response.data))
      .catch((error) => console.error(error));
  }, []);

  console.log(tareasPendientes);

  return (
    <Layout>
      <div className={s.mainCont}>
        <div className={s.contCont}>
          <div className={s.tareasCont}>
            <div className={s.title}>Pendientes</div>
            <div className={s.twoBtnCont}>
              <button
                onClick={() => marcarCompletadas()}
                className={
                  selectedPendientes.length != 0
                    ? s.compSelected
                    : s.compSelectedH
                }
              >
                Marcar como completadas
              </button>
              <button
                onClick={() => borrarPendientes()}
                className={
                  selectedPendientes.length != 0
                    ? s.borrarSelected
                    : s.borrarSelectedH
                }
              >
                Borrar tareas seleccionadas
              </button>
            </div>

            <ul>
              {tareasPendientes.map((tarea) => (
                <li className={s.li} key={tarea.id}>
                  <input
                    onChange={() => togglePendientes(tarea.id)}
                    type="checkbox"
                  />
                  <div className={s.liTitle}> {tarea.titulo} </div>
                  <div className={s.liTxt}> {tarea.descripcion} </div>

                  <button
                    onClick={() => editTarea(tarea.id)}
                    className={s.btn2}
                  >
                    editar
                  </button>
                  <button
                    className={s.btn}
                    onClick={() => borrarTarea(tarea.id)}
                  >
                    borrar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.together}>
            <div className={s.compCont}>
              <div className={s.title}>Completadas</div>
              <button
                onClick={() => borrarCompetas()}
                className={
                  selectedCompletas.length != 0
                    ? s.borrarSelected
                    : s.borrarSelectedH
                }
              >
                Borrar tareas seleccionadas
              </button>
              <ul>
                {tareasCompletas.map((tarea) => (
                  <li className={s.li} key={tarea.id}>
                    <input
                      type="checkbox"
                      onChange={() => toggleCompletas(tarea.id)}
                    />
                    <div className={s.liTitle}> {tarea.titulo} </div>
                    <div className={s.liTxt}> {tarea.descripcion} </div>

                    <button
                      className={s.btn}
                      onClick={() => borrarTarea(tarea.id)}
                    >
                      borrar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.nuevaCont}>
              <button onClick={() => setOpenCreate(true)} className={s.nueva}>
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={openCreate} setOpen={() => setOpenCreate(true)} float>
        <div className={s.modalCont}>
          <div className={s.modalContCont}>
            <div className={s.modalText}>
              Titulo:
              <input
                className={s.modalInput}
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className={s.modalText}>
              Descripción:
              <input
                className={s.modalInput}
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className={s.btnModalCont}>
              <button className={s.btnModal} onClick={crearTarea}>
                Crear Tarea
              </button>
              <button
                className={s.btnModal2}
                onClick={() => setOpenCreate(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={openEdit} setOpen={() => setOpenEdit(true)} float>
        <div className={s.modalCont}>
          <div className={s.modalContCont}>
            <div className={s.modalText}>
              Titulo:
              <input
                className={s.modalInput}
                type="text"
                placeholder={
                  editId &&
                  tareasPendientes.find((tarea) => tarea.id === editId)?.titulo
                }
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className={s.modalText}>
              Descripción:
              <input
                className={s.modalInput}
                type="text"
                placeholder={
                  editId &&
                  tareasPendientes.find((tarea) => tarea.id === editId)
                    ?.descripcion
                }
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className={s.btnModalCont}>
              <button className={s.btnModal} onClick={() => handleEdit()}>
                Editar Tarea
              </button>
              <button
                className={s.btnModal2}
                onClick={() => setOpenEdit(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
