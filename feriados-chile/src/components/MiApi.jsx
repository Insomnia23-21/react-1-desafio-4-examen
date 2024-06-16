import React, { useState, useEffect } from "react";

const MiApi = () => {
  // Almacena los feriados y los feriados filtrados por mes seleccionado
  const [feriados, setFeriados] = useState([]);
  const [filteredFeriados, setFilteredFeriados] = useState([]);
  // Almacena el mes seleccionado
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    // Llama a la API para obtener los feriados
    fetch("https://api.boostr.cl/feriados/en.json")
      .then((response) => response.json())
      .then((data) => {
        // Almacena los feriados de la API
        setFeriados(data);
        // Actualiza los feriados filtrados por el mes
        updateFilteredFeriados(selectedMonth, data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedMonth]);

  // Filtra los feriados por mes
  const updateFilteredFeriados = (month, data) => {
    const feriadosData = data.data; // Feriados de la respuesta de la API
    const filtered = feriadosData.filter((feriado) => {
      // Filtra los feriados del mes seleccionado
      const feriadoDate = new Date(`${feriado.date}T12:00:00`);
      return feriadoDate.getMonth() + 1 === month;
    });
    setFilteredFeriados(filtered);
  };

  // Mes anterior
  const handlePreviousMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
  };

  // Mes siguiente
  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
  };

  // Renderiza el calendario
  const renderDays = () => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, selectedMonth - 1, 1);
    const firstDayOfMonth = date.getDay();
    const lastDayOfMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`blank-${i}`}></td>);
    }

    for (let i = 1; i <= lastDayOfMonth; i++) {
      const isFeriado = filteredFeriados.some((feriado) => {
        const feriadoDate = new Date(`${feriado.date}T00:00:00`);
        return (
          feriadoDate.getDate() === i &&
          feriadoDate.getMonth() + 1 === selectedMonth
        );
      });
      //Define estilos para los feriados
      const dayStyle = isFeriado
        ? { backgroundColor: "red", color: "white" }
        : {};

      days.push(
        <td key={i} style={dayStyle}>
          {i}
          {isFeriado && (
            <div>
              {filteredFeriados.map((feriado) => {
                const feriadoDate = new Date(`${feriado.date}T00:00:00`);
                if (
                  feriadoDate.getDate() === i &&
                  feriadoDate.getMonth() + 1 === selectedMonth
                ) {
                  return (
                    <div key={feriado.date}>
                      <small>{feriado.title}</small>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </td>
      );
    }

    const rows = [];
    let cells = [];
    days.forEach((day, i) => {
      if (i % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(day);
      }
      if (i === days.length - 1) {
        rows.push(cells);
      }
    });

    return rows.map((row, i) => <tr key={i}>{row}</tr>);
  };

  return (
    <div //Define estilos del fondo
      className="container text-center"
      style={{
        backgroundColor: "deepskyblue",
        padding: "20px",
      }}
    >
      <h1>Feriados Legales en Chile</h1>
      <div className="row mb-3">
        <div className="col-md-12">
          <button
            className="btn btn-primary mr-2"
            onClick={handlePreviousMonth}
          >
            Mes Anterior
          </button>
          <h3 className="d-inline">
            {new Date(
              new Date().getFullYear(),
              selectedMonth - 1,
              1
            ).toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button className="btn btn-primary ml-2" onClick={handleNextMonth}>
            Mes Siguiente
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <table
            className="table table-bordered"
            style={{ border: "2px solid black" }}
          >
            <thead>
              <tr>
                <th>Domingo</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
              </tr>
            </thead>
            <tbody>{renderDays()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MiApi;
