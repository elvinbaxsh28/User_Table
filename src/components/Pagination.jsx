import React from "react";
import "./apiDataViewer.css";


const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page number click
  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const getButtonRange = () => {
    const range = [];

    // Calculate the minimum button number to display
    let minButton = currentPage - 2;
    if (minButton <= 0) {
      minButton = 1;
    }

    // Calculate the maximum button number to display
    let maxButton = minButton + 4;
    if (maxButton > totalPages) {
      maxButton = totalPages;
      minButton = maxButton - 4;
      if (minButton <= 0) {
        minButton = 1;
      }
    }

    for (let i = minButton; i <= maxButton; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="pagination">
      {currentPage > 3 && (
        <button
          onClick={() => handlePageClick(1)}
          className="pagination-button"
        >
          First
        </button>
      )}

      {getButtonRange().map((number) => (
        <button
          key={number}
          onClick={() => handlePageClick(number)}
          className={`pagination-button ${currentPage === number ? "active" : ""}`}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => handlePageClick(totalPages)}
          className="pagination-button"
        >
          Last
        </button>
      )}
    </div>
  );
};

export default Pagination;