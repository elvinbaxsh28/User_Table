import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import "./postList.css";
import Swal from "sweetalert2";

const PostList = () => {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAllColumns, setSelectAllColumns] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    email: true,
    username: true,
    phone: true,
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(data);
      localStorage.setItem("users", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchTerm.trim() === "") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Olmaz",
  //     });
  //     return;
  //   }

  //   const matchedUsers = users.filter((user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  //   if (matchedUsers.length === 0) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Name not found!",
  //     });
  //     setSearchTerm("");
  //     return;
  //   }

  //   const newSearchResults = [...searchResults, ...matchedUsers];

  //   // Remove duplicate names from the new search results
  //   const uniqueResults = newSearchResults.filter(
  //     (user, index, self) =>
  //       index === self.findIndex((u) => u.name === user.name)
  //   );

  //   setSearchResults(uniqueResults);
  //   setSearchTerm("");

  //   const updatedSelectedUsers = [...selectedUsers, ...matchedUsers];
  //   localStorage.setItem("selectedUsers", JSON.stringify(updatedSelectedUsers));
  //   setSelectedUsers(updatedSelectedUsers);
  // };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Olmaz",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();

      const matchedUsers = data.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ); // Daxil etdiyim adin API -da olub olmadigin yoxluyuram

      if (matchedUsers.length === 0) {
        Swal.fire(
                    'Was there such a name?',
                    'please write the names correctly',
                    'question'
                  )
        setSearchTerm("");
        return;
      }

      // AD movcuddursa 2 ci defe Table-a dusmesin
      const uniqueMatchedUsers = matchedUsers.filter(
        (user) =>
          !selectedUsers.find((selectedUser) => selectedUser.id === user.id)
        // Gonderilen Ad tapilmiyibsa user-e beraber edib table-a add etsin
      );

      if (uniqueMatchedUsers.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Name already added!",
        });
        setSearchTerm("");
        return;
      }

      // Yeni axtarıs neticelerinden dublikat adları arraydan silmek silmek
      const newSearchResults = [...searchResults, ...uniqueMatchedUsers];
      const uniqueResults = newSearchResults.filter(
        (
          user,
          index,
          self // self = newSearchResults // ozun index-ine beraber etmek
        ) => index === self.findIndex((u) => u.name === user.name) // icindeki elemntin indexin-de beraber etmek
      ); //index-i beraber ele selfe(newSearchResults) ve icindeki elementi gonderilen elemente beraber etsin
      // yani movcuddursa table-de qalsin
      setSearchResults(uniqueResults);
      setSearchTerm("");

      const updatedSelectedUsers = [...selectedUsers, ...uniqueMatchedUsers];
      localStorage.setItem(
        "selectedUsers",
        JSON.stringify(updatedSelectedUsers)
      );
      setSelectedUsers(updatedSelectedUsers);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch users from API.",
      });
    }
  };

  useEffect(() => {
    // true - dusa  data-ni set etsin eks halda fetch ile datani getirsin
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetchUsers();
    }

    // Localda Fetch-den gelen adlar varsa onlari set etsin
    const storedSelectedUsers = localStorage.getItem("selectedUsers");
    if (storedSelectedUsers) {
      setSelectedUsers(JSON.parse(storedSelectedUsers));
    }
  }, []);

  return (
    <div id="mainArea">
      <div id="leftSide" className={`navbar-${theme}`}>
        <h2>Sorğu</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Input"
            className={`input ${
              theme === "dark" ? "input-dark" : "input-light"
            }`}
          />
          <button type="submit" className="btn">
            Button Name
          </button>
        </form>
      </div>

      <div id="rightSide">
      {selectedUsers.length > 0 ? (
          <h2  style={{ color: theme === "light" ? "#fff" : "#606060" }} className="exampleTitle">
            <span>{selectedUsers[selectedUsers.length - 1].name}</span>
          </h2>
        ) : (
          <h2 style={{ color: theme === "light" ? "#fff" : "#606060" }} className="exampleTitle">Add Name</h2>
        )}

        <div id="rightTop">


          <div id="checkBoxes">
            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="selectAllColumns"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  disabled={selectAllColumns}
                  checked={selectAllColumns}
                  onChange={() => {
                    setSelectAllColumns(!selectAllColumns);
                    setColumnVisibility({
                      id: !selectAllColumns,
                      name: !selectAllColumns,
                      email: !selectAllColumns,
                      username: !selectAllColumns,
                      phone: !selectAllColumns,
                    });
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

            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="columnVisibility.id"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  checked={columnVisibility.id}
                  onChange={() =>
                    setColumnVisibility((prevState) => ({
                      ...prevState,
                      id: !prevState.id,
                    }))
                  }
                />
                <svg>
                  <use xlinkHref="#checkmark-28" />
                </svg>
                <label
                  htmlFor="columnVisibility.id"
                  style={{ color: theme === "light" ? "#f9e5e5" : "#c0bfbf" }}
                >
                  ID
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

            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="columnVisibility.name"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  checked={columnVisibility.name}
                  onChange={() =>
                    setColumnVisibility((prevState) => ({
                      ...prevState,
                      name: !prevState.name,
                    }))
                  }
                />
                <svg>
                  <use xlinkHref="#checkmark-28" />
                </svg>
                <label
                  htmlFor="columnVisibility.name"
                  style={{ color: theme === "light" ? "#f9e5e5" : "#c0bfbf" }}
                >
                  Name
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

            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="columnVisibility.email"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  checked={columnVisibility.email}
                  onChange={() =>
                    setColumnVisibility((prevState) => ({
                      ...prevState,
                      email: !prevState.email,
                    }))
                  }
                />
                <svg>
                  <use xlinkHref="#checkmark-28" />
                </svg>
                <label
                  htmlFor="columnVisibility.email"
                  style={{ color: theme === "light" ? "#D4D9DF" : "#D4D9DF" }}
                >
                  Email
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

            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="columnVisibility.username"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  checked={columnVisibility.username}
                  onChange={() =>
                    setColumnVisibility((prevState) => ({
                      ...prevState,
                      username: !prevState.username,
                    }))
                  }
                />
                <svg>
                  <use xlinkHref="#checkmark-28" />
                </svg>
                <label
                  htmlFor="columnVisibility.username"
                  style={{ color: theme === "light" ? "#f9e5e5" : "#c0bfbf" }}
                >
                  User
                </label>
              </div>
            </div>

            <div id="checkStyle" className={`navbar-${theme}`}>
              <div className="checkbox-wrapper-28">
                <input
                  id="columnVisibility.phone"
                  type="checkbox"
                  className="promoted-input-checkbox"
                  checked={columnVisibility.phone}
                  onChange={() =>
                    setColumnVisibility((prevState) => ({
                      ...prevState,
                      phone: !prevState.phone,
                    }))
                  }
                />
                <svg>
                  <use xlinkHref="#checkmark-28" />
                </svg>
                <label
                  htmlFor="columnVisibility.phone"
                  style={{ color: theme === "light" ? "#f9e5e5" : "#c0bfbf" }}
                >
                  Phone
                </label>
              </div>
            </div>
          </div>



          
        </div>

        <div id="tableArea">
          {true && (
            <div className="tableDiv">
              <table
                id="table"
                className={`table ${theme === "light" ? "table-dark" : ""}`}
              >
                <thead>
                  <tr>
                    {columnVisibility.id && <th className="fth">ID</th>}
                    {columnVisibility.name && <th>Name</th>}
                    {columnVisibility.email && <th>Email</th>}
                    {columnVisibility.username && <th>User</th>}
                    {columnVisibility.phone && <th>Phone</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          // Elementi Array-e ceviren method
                          Object.keys(columnVisibility).filter(
                            (key) => columnVisibility[key]
                          ).length
                        }
                      >
                        <p>No Users Selected</p>
                      </td>
                    </tr>
                  ) : (
                    selectedUsers.map((user) => (
                      <tr key={user.id}>
                        {columnVisibility.id && <td>{user.id}</td>}
                        {columnVisibility.name && <td>{user.name}</td>}
                        {columnVisibility.email && <td>{user.email}</td>}
                        {columnVisibility.username && <td>{user.username}</td>}
                        {columnVisibility.phone && <td>{user.phone}</td>}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default PostList;