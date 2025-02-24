import { useEffect, useState, createContext } from "react";
import "./App.css";
import "react-calendar/dist/Calendar.css";
// import { Route, BrowserRouter as Router} from "react-router-dom"
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout";
import Login from "./components/LoginPage";
import UpcomingPage from "./components/UpcomingPage";
import FinishedPage from "./components/FinishedPage";
import EvaluatePage from "./components/EvaluatePage";
import CreatePage from "./components/CreatePage";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { DEFAULT_USER } from "./components/Tools";
import EnrollPage from "./components/EnrollPage";

// import React, { createContext, useState } from "react";

// const UserAndLessonsContext = createContext();

// export const UserAndLessonsProvider = ({ children }) => {
//   const [theme, setTheme] = useState("light"); // default theme

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// 'react-bootstrap'

// Coaches can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly 1 student.

// Coaches can view their own upcoming slots.

// Coaches should be able to review their past scores and notes for all of their calls.

// Students can book upcoming, available slots for any coach.

// When a slot is booked, both the student and coach can view each other’s phone-number.

// After they complete a call with a student, coaches will record the student’s satisfaction (an integer 1-5) and write some free-form notes.

function App() {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [finishedLessons, setFinishedLessons] = useState([]);
  const [lessonsToGrade, setLessonsToGrade] = useState([]);
  const [allLessons, setAllLessons] = useState([]);

  const [user, setUser] = useState(DEFAULT_USER);
  const [page, setPage] = useState("upcoming");

  const updateUser = (user, type) => {
    setUpcomingLessons([]);
    setFinishedLessons([]);
    setLessonsToGrade([]);

    user["type"] = type;
    setUser(user);
    refreshLessons(user.id, user.type);
  };

  useEffect(() => {
    updateUser(DEFAULT_USER, "student");
  }, []);

  const lessonsGetUrl = (userId, userType) =>
    userType === "coach"
      ? `http://localhost:3000/coach/${userId}/lessons`
      : `http://localhost:3000/student/${userId}/lessons`;

  const sortLessons = (lessons) => {
    let oldLessons = [];
    let newLessons = [];
    let unfinishedLessons = [];
    const dateNow = new Date();

    lessons.forEach((lesson) => {
      const lessonDate = new Date(`${lesson.date} ${lesson.time}:00`);

      if (lessonDate > dateNow) {
        newLessons.push(lesson);
      } else {
        if (user.type === "coach") {
          lesson.score
            ? oldLessons.push(lesson)
            : unfinishedLessons.push(lesson);
        } else {
          oldLessons.push(lesson);
        }
      }
    });

    setAllLessons(lessons);
    setUpcomingLessons(newLessons);
    setFinishedLessons(oldLessons);
    setLessonsToGrade(unfinishedLessons);

    console.log();
    setPage("upcoming");
  };

  const refreshLessons = (userId, userType) => {
    fetch(lessonsGetUrl(userId, userType))
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        console.log("lessons are:", res);
        sortLessons(res);
      });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="me-auto">
            <Navbar.Text className="me-3" onClick={() => setPage("upcoming")}>
              Upcoming
            </Navbar.Text>
            <Navbar.Text className="me-3" onClick={() => setPage("finished")}>
              Finished
            </Navbar.Text>
            {user.type === "student" && (
              <Navbar.Text className="me-3" onClick={() => setPage("enroll")}>
                Enroll
              </Navbar.Text>
            )}
            {user.type === "coach" && (
              <Navbar.Text className="me-3" onClick={() => setPage("create")}>
                Create
              </Navbar.Text>
            )}
            {user.type === "coach" && (
              <Navbar.Text className="me-3" onClick={() => setPage("evaluate")}>
                Evaluate
              </Navbar.Text>
            )}
          </Nav>
          <Nav>
            <Navbar.Text className="me-3" onClick={() => setPage("login")}>
              Switch Users
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>

      <div>
        {page == "upcoming" && (
          <UpcomingPage
            userType={user.type}
            upcomingLessons={upcomingLessons}
          />
        )}
        {page == "finished" && (
          <FinishedPage
            userType={user.type}
            finishedLessons={finishedLessons}
          />
        )}
        {page == "evaluate" && (
          <EvaluatePage userType={user.type} lessonsToGrade={lessonsToGrade} />
        )}
        {page == "enroll" && (
          <EnrollPage userType={user.type} lessonsToGrade={lessonsToGrade} />
        )}
        {page == "create" && (
          <CreatePage
            userId={user.id}
            setPage={setPage}
            allLessons={allLessons}
            refreshLessons={refreshLessons}
          />
        )}

        {page == "login" && <Login updateUser={updateUser} />}
      </div>
    </>
    // <Routes>
    //   <Route path="/" exact element={<Layout />}>
    //     <Route path="signUp" element={<p>hi gozxczxcys!</p>} />
    //     <Route
    //       path="upcoming"
    //       element={<upcomingPage userId={user.id} userType={user.type} />}
    //     />
    //   </Route>
    // </Routes>
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    //   </>
  );
}

export default App;
