// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const url =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);

  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = projects?.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(url);
        setProjects(response.data);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleNextPage = () => {
    const totalPages = Math.ceil(projects.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 > visiblePages[visiblePages.length - 1]) {
        setVisiblePages(visiblePages.map((page) => page + 1));
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 < visiblePages[0]) {
        setVisiblePages(visiblePages.map((page) => page - 1));
      }
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <h1 className="title">Kickstarter Projects</h1>
      <table className="project-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>% Percentage Funded</th>
            <th>$ Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{item["percentage.funded"]}%</td>
              <td>${item["amt.pledged"].toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          {"<< Prev"}
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={currentPage === page ? "active" : ""}
            disabled={page > Math.ceil(projects.length / itemsPerPage)}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(projects.length / itemsPerPage)}
        >
          {"Next >>"}
        </button>
      </div>
    </div>
  );
};

export default App;
