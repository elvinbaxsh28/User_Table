import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import Swal from "sweetalert2";
import "./appData.css";

function AppData() {
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [endpointsInput, setEndpointsInput] = useState("");
  const [selectAllColumns, setSelectAllColumns] = useState(true);
  const [endpoints, setEndpoints] = useState(() => {
    const storedEndpoints = localStorage.getItem("endpoints");
    return storedEndpoints ? JSON.parse(storedEndpoints) : [];
  });

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const storedColumnVisibility = localStorage.getItem("columnVisibility");
    return storedColumnVisibility
      ? JSON.parse(storedColumnVisibility)
      : {
          "/posts": {
            id: true,
            name: true,
            email: true,
            username: true,
            phone: true,
          },
          "/comments": {
            postId: true,
            id: true,
            name: true,
            email: true,
            body: true,
          },
          "/albums": {
            userId: true,
            id: true,
            title: true,
            completed: true,
          },
          "/photos": {
            albumId: true,
            id: true,
            title: true,
            url: true,
            thumbnailUrl: true,
          },
          "/todos": {
            userId: true,
            id: true,
            title: true,
          },
          "/users": {
            userId: true,
            id: true,
            name: true,
            email: true,
            username: true,
            phone: true,
          },
        };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    localStorage.setItem("endpoints", JSON.stringify(endpoints));
  }, [endpoints]);

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const requests = endpoints.map(async (endpoint) => {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com${endpoint}`
        );
        const json = await response.json();
        return { endpoint, data: json };
      });

      const results = await Promise.all(requests);
      const dataObj = results.reduce((acc, { endpoint, data }) => {
        acc[endpoint] = data;
        return acc;
      }, {});

      setData(dataObj);
      setLoading(false);
    };

    fetchData();
  }, [endpoints]);

  const handleInputChange = (event) => {
    setEndpointsInput(event.target.value);
  };

  const handleButtonClick = () => {
    const trimmedInput = endpointsInput.trim();

    if (trimmedInput === "") {
      Swal.fire({
        title: "Empty Value",
        text: "Please enter a value.",
        icon: "error",
      });
      return;
    }
    const inputEndpoints = trimmedInput.split(" ");

    const invalidEndpoints = inputEndpoints.filter(
      (endpoint) => !getColumns(endpoint).length
    );

    if (invalidEndpoints.length > 0) {
      Swal.fire({
        title: "Invalid API Name",
        text: `The Invalid Name is: ${invalidEndpoints.join(", ")}`,
        icon: "error",
      });
      return;
    }

    const updatedColumnVisibility = { ...columnVisibility };
    inputEndpoints.forEach((endpoint) => {
      if (!updatedColumnVisibility.hasOwnProperty(endpoint)) {
        updatedColumnVisibility[endpoint] = getColumns(endpoint).reduce(
          (obj, column) => {
            obj[column] = true;
            return obj;
          },
          {}
        );
      }
    });

    setEndpoints(inputEndpoints);
    setColumnVisibility(updatedColumnVisibility);
    setCurrentPage(1);
    setEndpointsInput("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [endpointsInput]);

  const getColumns = (endpoint) => {
    switch (endpoint) {
      case "/posts":
        return ["userId", "id", "title", "body"];
      case "/comments":
        return ["postId", "id", "name", "email", "body"];
      case "/albums":
        return ["userId", "id", "title"];
      case "/photos":
        return ["albumId", "id", "title", "url", "thumbnailUrl"];
      case "/todos":
        return ["userId", "id", "title"];
      case "/users":
        return ["id", "name", "email", "username", "phone"];
      default:
        return [];
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderTable = (endpoint, columns) => {
    const endpointData = data[endpoint] || [];
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const paginatedData = endpointData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(endpointData.length / rowsPerPage);

    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = currentPage === i;
      const buttonStyle = {
        color: isActive ? "#fff" : "",
        background: isActive ? "#4196e4" : "",
      };
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className="pageButton"
          style={isActive ? buttonStyle : null}
        >
          {i}
        </button>
      );
    }

    return (
      <div id="mainArea">
        <div key={endpoint} id="rightSide">
          <h2
            className="exampleTitle"
            style={{ color: theme === "light" ? "#fff" : "#606060" }}
          >
            {endpoint.substring(1)}
          </h2>

          <div id="rightTop">
            <div id="checkBoxes">
              <div id="checkStyle" className={`navbar-${theme}`}>
                <div className="checkbox-wrapper-28">
                  <input
                    id={`selectAllColumns.${endpoint}`}
                    type="checkbox"
                    className="promoted-input-checkbox"
                    disabled={!selectAllColumns}
                    checked={
                      selectAllColumns &&
                      Object.values(columnVisibility[endpoint]).some(
                        (value) => value
                      )
                    }
                    onChange={() => {
                      setColumnVisibility((prevState) => {
                        const updatedVisibility = { ...prevState[endpoint] };
                        Object.keys(updatedVisibility).forEach((key) => {
                          updatedVisibility[key] = selectAllColumns;
                        });

                        return {
                          ...prevState,
                          [endpoint]: updatedVisibility,
                        };
                      });
                    }}
                  />
                  <svg>
                    <use xlinkHref="#checkmark-28" />
                  </svg>
                  <label
                    htmlFor={`selectAllColumns.${endpoint}`}
                    style={{ color: theme === "light" ? "#f9e5e5" : "#c0bfbf" }}
                  >
                    All
                  </label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "none" }}
                  >
                    <symbol id="checkmark-28" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        fill="none"
                        d="M22.9 3.7l-15.2 16.6-6.6-7.1"
                      ></path>
                    </symbol>
                  </svg>
                </div>
              </div>

              {columns.map((column) => (
                <div key={column} id="checkStyle" className={`navbar-${theme}`}>
                  <div className="checkbox-wrapper-28">
                    <input
                      id={`columnVisibility.${endpoint}.${column}`}
                      type="checkbox"
                      className="promoted-input-checkbox"
                      checked={columnVisibility[endpoint][column]}
                      onChange={() =>
                        setColumnVisibility((prevState) => {
                          const updatedVisibility = { ...prevState[endpoint] };
                          updatedVisibility[column] =
                            !updatedVisibility[column];

                          return {
                            ...prevState,
                            [endpoint]: updatedVisibility,
                          };
                        })
                      }
                    />
                    <svg>
                      <use xlinkHref="#checkmark-28" />
                    </svg>
                    <label
                      htmlFor={`columnVisibility.${endpoint}.${column}`}
                      style={{
                        color: theme === "light" ? "#f9e5e5" : "#c0bfbf",
                      }}
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </label>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: "none" }}
                    >
                      <symbol id="checkmark-28" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeMiterlimit="10"
                          fill="none"
                          d="M22.9 3.7l-15.2 16.6-6.6-7.1"
                        ></path>
                      </symbol>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tableDiv">
            <table
              id="table"
              className={`table ${theme === "light" ? "table-dark" : ""}`}
            >
              <thead>
                <tr>
                  {columns.map(
                    (column) =>
                      // Check if the column should be visible for the endpoint
                      columnVisibility[endpoint][column] && (
                        <th key={column}>{column}</th>
                      )
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map(
                      (column) =>
                        columnVisibility[endpoint][column] && (
                          <td key={column}>{row[column]}</td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagBtn"
              style={{
                color: theme === "light" ? "#fff" : "#555",
                background: theme === "light" ? "#555" : "#fff",
              }}
            >
              Prev
            </button>
            <span className="currentPage">{pageButtons}</span>
            <button
              onClick={handleNextPage}
              disabled={lastIndex >= endpointData.length}
              className="pagBtn"
              style={{
                color: theme === "light" ? "#fff" : "#555",
                background: theme === "light" ? "#555" : "#fff",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="mainArea">
      <div id="leftSide" className={`navbar-${theme}`}>
        <h2 style={{ color: theme === "light" ? "#fff" : "#606060" }}>Sorgu</h2>
        <input
          type="text"
          value={endpointsInput}
          onChange={handleInputChange}
          placeholder="Input"
          className={`input ${theme === "dark" ? "input-dark" : "input-light"}`}
        />
        <button onClick={handleButtonClick} className="btn">
          Button
        </button>
      </div>

      {loading && (
        <h2 style={{ color: theme === "light" ? "#fff" : "#606060" }}>
          Loading data...
        </h2>
      )}

      {!loading && endpoints.length === 0 && (
        <h2 style={{ color: theme === "light" ? "#fff" : "#606060" }}>
          Data not found
        </h2>
      )}

      {!loading && endpoints.length > 0 && (
        <>
          {endpoints.map((endpoint) => {
            const columns = getColumns(endpoint);
            return renderTable(endpoint, columns);
          })}
        </>
      )}
    </div>
  );
}

export default AppData;
