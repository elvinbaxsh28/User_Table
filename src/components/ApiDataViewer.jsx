import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import "./apiDataViewer.css";
import { ThemeContext } from "./ThemeContext";
import Pagination from "react-bootstrap/Pagination";

function ApiDataViewer() {
  const { theme } = useContext(ThemeContext);
  const [apiName, setApiName] = useState("");
  const [data, setData] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/${apiName}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      initializeColumnVisibility(jsonData, true); // Pass true to activate all checkboxes
    } catch (error) {
      console.error(error);
      setData([]);
      setColumnVisibility({});
    }
  };

  const initializeColumnVisibility = (jsonData, activateAll) => {
    const columns = Object.keys(jsonData[0] || {});
    const initialVisibility = columns.reduce((acc, column) => {
      acc[column] = activateAll ? true : false; // Set all checkboxes active if activateAll is true
      return acc;
    }, {});
    setColumnVisibility(initialVisibility);
  };

  const renderTableCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div id="mainArea">
      <div id="leftSide">
        <input
          type="text"
          value={apiName}
          onChange={(e) => setApiName(e.target.value)}
          placeholder="Input"
        />
        <button onClick={fetchData}>Fetch Data</button>
      </div>

      <div id="rightSide">
        {data.length > 0 && (
          <div id="rightTop">
            <div id="checkBoxes">
              <div id="checkStyle" className={`navbar-${theme}`}>
                <div className="checkbox-wrapper-28">
                  <input
                    id="selectAllColumns"
                    type="checkbox"
                    className="promoted-input-checkbox"
                    checked={Object.values(columnVisibility).every(
                      (value) => value
                    )}
                    onChange={() => {
                      const allSelected = Object.values(columnVisibility).every(
                        (value) => value
                      );
                      const updatedVisibility = Object.keys(
                        columnVisibility
                      ).reduce((acc, column, index) => {
                        acc[column] =
                          !allSelected || (index === 0 && allSelected); // Enable the first column if not all are selected or if all are selected
                        return acc;
                      }, {});
                      setColumnVisibility(updatedVisibility);
                    }}
                  />

                  <svg>
                    <use xlinkHref="#checkmark-28" />
                  </svg>
                  <label
                    htmlFor="selectAllColumns"
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

              {Object.keys(columnVisibility).map((column, index) => (
                <div key={column} id="checkStyle" className={`navbar-${theme}`}>
                  <div className="checkbox-wrapper-28">
                    <input
                      id={`columnVisibility.${column}`}
                      type="checkbox"
                      className="promoted-input-checkbox"
                      checked={columnVisibility[column]}
                      disabled={
                        index === 0 &&
                        Object.values(columnVisibility).every((value) => value)
                      } // Disable the first checkbox only when all checkboxes are selected
                      onChange={() =>
                        setColumnVisibility((prevState) => ({
                          ...prevState,
                          [column]: !prevState[column],
                        }))
                      }
                    />

                    <svg>
                      <use xlinkHref="#checkmark-28" />
                    </svg>
                    <label
                      htmlFor={`columnVisibility.${column}`}
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
        )}

        <div id="tableDiv">
          {data.length > 0 && (
            <>
              <table
                id="table"
                className={`table ${theme === "light" ? "table-dark" : ""}`}
              >
                <thead>
                  <tr>
                    {Object.keys(columnVisibility)
                      .filter((column) => columnVisibility[column])
                      .map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={index}>
                      {Object.entries(item)
                        .filter(([column]) => columnVisibility[column])
                        .map(([column, value], i) => (
                          <td key={i}>{renderTableCell(value)}</td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiDataViewer;
