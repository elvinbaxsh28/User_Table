import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import "./apiDataViewer.css";
import { ThemeContext } from "./ThemeContext";
import Pagination from "./Pagination";

function ApiDataViewer() {
  const { theme } = useContext(ThemeContext);
  const [apiName, setApiName] = useState("");
  const [data, setData] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

  // Calculate the indexes of the first and last items of the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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

  // const renderTableCell = (value) => {
  //   const maxLength = 20; // Maximum length of displayed value
  //   if (typeof value === "object" && value !== null) {
  //     return JSON.stringify(value);
  //   } else if (typeof value === "string" && value.length > maxLength) {
  //     return value.substring(0, maxLength) + "...";
  //   }
  //   return value;
  // };
  const renderTableCell = (value) => {
    const maxLength = 16; // Maximum length of displayed value

    if (typeof value === "object" && value !== null) {
      // If the value is an object, convert it to a JSON string
      const jsonString = JSON.stringify(value);
      if (jsonString.length > maxLength) {
        // Truncate the JSON string if it exceeds the maximum length
        return jsonString.substring(0, maxLength) + "...";
      }
      return jsonString;
    } else if (typeof value === "string" && value.length > maxLength) {
      // Truncate string values if they exceed the maximum length
      return value.substring(0, maxLength) + "...";
    }

    return value;
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page
  };

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
                    checked={Object.values(columnVisibility).filter(
                      //every//some
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

        <div id="tableDiv" >
          {data.length > 0 && (
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
                {currentItems.map((item, index) => (
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
          )}
   
        </div>

     <div>
             
     {data.length === 0 && (
            <div id="noDataMessage">
              No data available. Please fetch data from an API.
            </div>
          )}

          {data.length > 0 && (
            <div>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
     </div>

      </div>
    </div>
  );
}

export default ApiDataViewer;