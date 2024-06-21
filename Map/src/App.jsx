import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Main from "./components/Main";
import * as d3 from "d3";

function App() {
  const [datasets, setDatasets] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const getter = async () => {
      const kickres = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
      );
      const movres = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
      );
      const vidres = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
      );
      const kick = await kickres.json();
      const vid = await vidres.json();
      const mov = await movres.json();
      const sets = [vid, mov, kick];
      setDatasets(sets);
      setCurrent(sets[0]);
    };
    getter();
  }, []);
  return current ? (
    <div
      id="main"
      style={{ position: "absolute", minHeight: "100vh", minWidth: "100vw" }}
    >
      <div className="navbar">
        <ul>
          {datasets.map((set, i) => {
            return (
              <li key={set.name}>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrent(set);
                  }}
                >
                  {set.name.split(" ").slice(0, 2).join(" ")} Data Set
                </a>
                {i < datasets.length - 1 ? <span>|</span> : <span></span>}
              </li>
            );
          })}
        </ul>
      </div>
      <Main current={current}></Main>
    </div>
  ) : (
    <>
      <p>...Loading</p>
    </>
  );
}

export default App;
