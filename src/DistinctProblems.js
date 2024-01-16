import React, { useState } from "react";
import logo from "./logoCF.png";
import { Link } from "react-router-dom";
import styles from "./ApiCall.module.css";

const DistinctProblems = () => {
  const [user, setUser] = useState("");
  const [altUser, setAltUser] = useState("");
  const [friend, setFriend] = useState("");
  const [distinctProblems, setDistinctProblems] = useState([]);
  const [sortOption, setSortOption] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [counter, setCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const fetchDistinctProblems = async () => {
    if (user.trim() === "") {
      alert("Please enter a valid User Handle");
      return;
    }
    if (friend.trim() === "") {
      alert("Please enter a valid Friend's User Handle");
      return;
    }
    if (altUser.trim() === "") {
      altUser = user;
    }
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${user}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      // Your data II
      const response2 = await fetch(
        `https://codeforces.com/api/user.status?handle=${altUser}`
      );
      if (!response2.ok) {
        throw new Error("Failed to fetch data");
      }
      const data2 = await response2.json();

      // Friend data
      const response1 = await fetch(
        `https://codeforces.com/api/user.status?handle=${friend}`
      );
      if (!response1.ok) {
        throw new Error("Failed to fetch data");
      }
      const data1 = await response1.json();
      if (
        data.status === "OK" &&
        data1.status === "OK" &&
        data2.status === "OK"
      ) {
        const yourSolvedProblemsII = new Set(
          data2.result
            .filter((submission) => submission.verdict === "OK")
            .map((submission) => submission.problem.name)
        );

        const yourSolvedProblems = new Set(
          data.result
            .filter((submission) => submission.verdict === "OK")
            .map((submission) => submission.problem.name)
        );
        for (let item of yourSolvedProblemsII) {
          yourSolvedProblems.add(item);
        }
        const friendSolvedProblems = new Set(
          data1.result
            .filter((submission) => submission.verdict === "OK")
            .map((submission) => submission.problem.name)
        );

        const seenCombinations = new Set();

        const uniqueFriendProblems = [];

        data1.result.forEach((submission) => {
          if (
            submission.verdict === "OK" &&
            !yourSolvedProblems.has(submission.problem.name)
          ) {
            const problemKey = `${submission.problem.contestId}_${submission.problem.index}`;

            if (!seenCombinations.has(problemKey)) {
              seenCombinations.add(problemKey);

              uniqueFriendProblems.push({
                contestId: submission.problem.contestId,
                index: submission.problem.index,
                rating: submission.problem.rating,
                name: submission.problem.name,
                submissionTime: submission.creationTimeSeconds,
              });
            }
          }
        });
        setCounter(uniqueFriendProblems.length);
        setDistinctProblems(uniqueFriendProblems);
      } else {
        throw new Error("Failed to get user status");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const sortTable = (option) => {
    const sortedProblems = [...distinctProblems];

    if (option === sortOption) {
      // Toggle sort order if clicking on the same option
      sortedProblems.reverse();
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Sort in ascending order by default
      sortedProblems.sort((a, b) => a[option] - b[option]);
      setSortOrder("asc");
    }

    setSortOption(option);
    setDistinctProblems(sortedProblems);
  };
  const [buttonStyle, setButtonStyle] = useState({
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  });

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
  };
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          User Handle
          <input
            type="text"
            onChange={(ev) => setUser(ev.target.value)}
            required
            style={{
              padding: "8px",
              width: "10%",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              marginLeft: "10px",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          User Handle II (Alt Handle)😅😅
          <input
            type="text"
            onChange={(ev) => setAltUser(ev.target.value)}
            required
            style={{
              padding: "8px",
              width: "10%",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              marginLeft: "10px",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Your Friend's UserId
          <input
            type="text"
            onChange={(ev) => setFriend(ev.target.value)}
            required
            style={{
              padding: "8px",
              width: "10%",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              marginLeft: "10px",
            }}
          />
        </label>
      </div>
      <button
        style={buttonStyle}
        onMouseOver={() => {
          // Apply hover styles on mouse over
          setButtonStyle((prevStyle) => ({
            ...prevStyle,
            ...buttonHoverStyle,
          }));
        }}
        onMouseOut={() => {
          // Reset styles on mouse out
          setButtonStyle((prevStyle) => ({
            ...prevStyle,
            backgroundColor: "#4CAF50",
          }));
        }}
        type="submit"
        onClick={fetchDistinctProblems}
      >
        Show Results
      </button>

      <div>
        <h2>Solved Problems:{counter} </h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th onClick={() => sortTable("contestId")}>Contest ID</th>
              <th onClick={() => sortTable("index")}>Index</th>
              <th onClick={() => sortTable("rating")}>Rating</th>
              <th onClick={() => sortTable("submissionTime")}>
                Submission Time
              </th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {distinctProblems.map((problem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{problem.contestId}</td>
                <td>{problem.index}</td>
                <td>{problem.rating}</td>
                <td>
                  {new Date(problem.submissionTime * 1000).toLocaleString()}
                </td>

                <td>
                  <a
                    href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                    style={{ textDecoration: "none", color: "blue" }}
                    target="_blank"
                  >
                    {problem.name}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistinctProblems;
