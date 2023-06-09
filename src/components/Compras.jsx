import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const PRECIO_DOLAR = 5000;

function Compras() {
  const [material, setMaterial] = useState("");
  const [dije, setDije] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [moneda, setMoneda] = useState("USD");

  const [listaProductos, setListaProductos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [master, setMaster] = useState();

  const [id, setId] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, "productos"), (query) => {
          setListaProductos(
            query.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
        });
        await onSnapshot(collection(db, "catalogo"), (query) => {
          const data = query.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setCatalogo(
            data.filter(({ id }) => id !== "master")
          );

          setMaster(
            data.find(({ id }) => id === "master")
          );
        });
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  const calcularPrecio = (producto, total) => {
    const catalogoItem = catalogo.find(
      (i) =>
        i.material === producto.material &&
        i.dije === producto.dije &&
        i.tipo === producto.tipo
    );

    const unitario = ((catalogoItem ?? {}).valor_usd ?? 0)

    return total ? producto.cantidad * unitario : unitario;
  };

  const convertirMoneda = (precio) => {
    const conversor = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: moneda,
    });

    const factor = (moneda === "USD" ? 1 : PRECIO_DOLAR);
    return conversor.format(precio * factor);
  };

  const calcularTotalCompra = () => {
    return listaProductos.reduce((acc, curr) => acc + curr.precio, 0)
  }

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      const nuevoProducto = {
        material: material,
        tipo: tipo,
        cantidad: cantidad,
        dije: dije,
      };

      nuevoProducto.precio = calcularPrecio(nuevoProducto, true);

      if (modoEdicion) {
        const docRef = doc(db, "productos", id);
        await updateDoc(docRef, nuevoProducto);

        setListaProductos(
          listaProductos.map((producto) =>
            producto.id === id ? { id, ...nuevoProducto } : producto
          )
        );
      } else {
        const data = await addDoc(collection(db, "productos"), nuevoProducto);

        setListaProductos([
          ...listaProductos,
          { id: data.id, ...nuevoProducto },
        ]);
      }

      limpiar();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
    } catch (error) {
      console.log(error);
    }
  };

  const editar = (producto) => {
    setDije(producto.dije);
    setMaterial(producto.material);
    setTipo(producto.tipo);
    setCantidad(producto.cantidad);
    setId(producto.id);
    setModoEdicion(true);
  };

  const limpiar = () => {
    setDije("");
    setMaterial("");
    setTipo("");
    setCantidad(1);
    setId("");
    setModoEdicion(false);
  };

  return (
    <div className="container mt-5">
      <h4 className="text-center">Elija y combine su manilla con los materiales que desee</h4>
      <hr />

      <div className="container-xs ">
        <h5 color="rgb(28, 110, 3)">Tipo de moneda con la que va a cancelar:</h5>
        <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="form-select">
          <option key="USD" value="USD">Dólares (USD)</option>
          <option key="COP" value="COP">Pesos Colombianos</option>
        </select>
        <br></br>
      </div>

      <div className="row">
        <div className="col-8">
          <h5 className="text-center">Combinación(es) Elegidas</h5>
          <ul className="list-group">
            {listaProductos.map((producto) => (
              <li key={producto.id} className="list-group-item">
                <span className="lead">
                  {producto.material} - {producto.dije} - {producto.tipo}
                  <br /> Cantidad: {producto.cantidad}
                  <br /> Valor: {convertirMoneda(producto.precio)}
                </span>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="botton"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => editar(producto)}
                  className="button"
                >
                  Editar
                </button>
              </li>
            ))}
            <li className="list-group-item">
                <h5 className="text-center">Total de la Compra: {convertirMoneda(calcularTotalCompra())}</h5>
            </li>
          </ul>
        </div>
        <div className="col-4">
          <h5 className="text-center">Agregar al carrito</h5>
          {master && (
            <form onSubmit={guardarProducto}>
              <input
                value={cantidad}
                min="seleccione el producto"
                onChange={(e) => setCantidad(e.target.value)}
                type="number"
                className="form-control mb-4"
                placeholder="Ingrese la cantidad a comprar"
              />
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="form-select"
              >
                <option disabled value="">Seleccione el material</option>
                {master.materiales.map((material) => (
                  <option key={material}>{material}</option>
                ))}
              </select>
              <select
                value={dije}
                onChange={(e) => setDije(e.target.value)}
                className="form-select"
              >
                <option disabled value="">Seleccione un dije</option>
                {master.dijes.map((dije) => (
                  <option key={dije}>{dije}</option>
                ))}
              </select>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="form-select"
              >
                <option disabled value="">Seleccione un tipo</option>
                {master.tipos.map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>

              <ul className="list-group mt-4">
                <li className="list-group-item">Valor Unitario: {
                  convertirMoneda(calcularPrecio({ material, dije, tipo, cantidad }))
                }</li>
                <li className="list-group-item">Valor Total de la Compra: {
                  convertirMoneda(calcularPrecio({ material, dije, tipo, cantidad }, true))
                }</li>
              </ul>

              <div className="btn-group mt-5">
                {modoEdicion ? (
                    <>
                    <button
                        onClick={limpiar}
                        className="botton"
                    >
                        Cancelar
                    </button>
                    <button className="button">
                        Guardar Cambios
                    </button>
                    </>
                ) : (
                    <button className="button">Agregar al carrito</button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compras;