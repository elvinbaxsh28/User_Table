import React from "react";
import "./apiDataViewer.css";


const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange
}) => {
  const pageNumbers = [];

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate an array of page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page number click
  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      )}
      {pageNumbers.map((number) => {
        if (currentPage > 5 && number === totalPages - 0) {
          return (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`pagination-button ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          );
        }
        if (number === totalPages) {
          return (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`pagination-button ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          );
        }
        if (number <= 5) {
          return (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`pagination-button ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          );
        }
        if (number === 6 && totalPages > 6) {
          return (
            <span key="ellipsis">...</span>
          );
        }
        return null; // Skip page numbers greater than 6
      })}
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;