import React, { useState } from "react";
import axios from "axios";

const DataViewer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fetchData = async (endpoint) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jsonplaceholder.typicode.com${endpoint}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const endpoint = event.target.value;
    setInputValue(endpoint);
    if (endpoint !== "/") {
      fetchData(endpoint);
    } else {
      setData([]);
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setData([]); // data'nın boş bir dizi olarak ayarlanması
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter endpoint"
      />
      <button onClick={handleClearInput}>Clear</button>
      <table style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            Array.isArray(data) && // data'nın bir dizi olup olmadığını kontrol etmek için Array.isArray kullanılıyor
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.body}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataViewer;
