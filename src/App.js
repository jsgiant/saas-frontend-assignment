// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        );
        setProjects(response.data);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentItems = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <h1>Kickstarter Projects</h1>
      {loading && <p aria-live="polite">Loading projects...</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <table className="projects-table" aria-label="Kickstarter Projects">
            <thead>
              <tr>
                <th scope="col">S.No.</th>
                <th scope="col">Percentage Funded</th>
                <th scope="col">Amount Pledged</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{project["percentage.funded"]}</td>
                  <td>{project["amt.pledged"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination" role="navigation" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
                aria-current={currentPage === i + 1 ? "page" : undefined}
                data-testid={`page-${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
