import "./App.css";
import React, { useState } from "react";

export default function App() {
  let [input, setInput] = useState("");
  let [data, setData] = useState([]);
  let [forkedData, setForkedData] = useState([]);
  let [isSubmitted, setIsSubmitted] = useState(false);
  let [isForked, setIsForked] = useState(false);

  // text box input
  function handleChange(e) {
    setInput(e.target.value);
  }

  // sorting function
  function sortData(sortKey, data, reverse) {
    const sortedData = data.sort((a, b) => {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });

    if (reverse) {
      return sortedData.reverse();
    }

    return sortedData;
  }

  // handling checkbox
  async function handleCheck(e) {
    setIsForked(e.target.checked);
    if (e.target.checked) {
      setData(sortData("size", forkedData, true));
    }
  }

  //api call
  async function handleSubmit(name) {
    let url = `https://api.github.com/users/${name}/repos`;
    let fetchData = await fetch(url);
    let res = await fetchData.json();

    // let resultForked = await res.filter((res) => res.fork === true);
    let result = await res.filter((res) => res.fork === false);
    if (isForked) {
      setData(sortData("size", res, true));
    } else {
      setData(sortData("size", result, true));
    }

    setForkedData(res);
    setIsSubmitted(true);
  }

  return (
    <div className="App">
      <div className="formPanel">
        <label>Github username: </label>
        <input type="text" onChange={handleChange} id="name" />
        <label>Include forks: </label>
        <input type="checkbox" onChange={handleCheck} id="includeFork" />
        <button
          className={input.length > 0 ? "cyan" : "grey"}
          onClick={() => handleSubmit(input)}
          disabled={input.length > 0 ? false : true}
        >
          Submit
        </button>
      </div>

      {isSubmitted && data.length === 0 ? (
        <div className="notFound">Not Found</div>
      ) : isSubmitted ? (
        <div className="outputTable">
          <table>
            <tr>
              <th>Name</th>
              <th>Language</th>
              <th>Description</th>
              <th>Size</th>
            </tr>
            {data.map((user) => {
              return (
                <tr>
                  <td>{user.name}</td>
                  <td>{user.language}</td>
                  <td>{user.description}</td>
                  <td>{user.size}</td>
                </tr>
              );
            })}
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
