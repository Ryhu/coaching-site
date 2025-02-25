import { useEffect, useState, createContext } from "react";
import "./App.css";
import "react-calendar/dist/Calendar.css";
// import { Route, BrowserRouter as Router} from "react-router-dom"
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [enrollableLessons, setEnrollableLessons] = useState([]);

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

  let lessonToEditUrl = (lessonToEdit) =>
    `http://localhost:3000/lesson/${lessonToEdit}`;

  const filterEnrollables = (enrollables) => {
    const dateNow = new Date();

    const enrollableLessonsTemp = (enrollables || []).filter((enrollable) => {
      const enrollableDate = new Date(
        `${enrollable.date} ${enrollable.time}:00`
      );
      return enrollableDate > dateNow;
    });

    setEnrollableLessons(enrollableLessonsTemp);
  };

  const sortLessons = (lessons, userType) => {
    let oldLessons = [];
    let newLessons = [];
    let unfinishedLessons = [];
    const dateNow = new Date();
    lessons.forEach((lesson) => {
      const lessonDate = new Date(`${lesson.date} ${lesson.time}:00`);

      if (lessonDate > dateNow) {
        newLessons.push(lesson);
      } else {
        if (userType === "coach") {
          if (lesson.student != null) {
            lesson.score
              ? oldLessons.push(lesson)
              : unfinishedLessons.push(lesson);
          }
        } else {
          oldLessons.push(lesson);
        }
      }
    });

    setAllLessons(lessons);
    setUpcomingLessons(newLessons);
    setFinishedLessons(oldLessons);
    setLessonsToGrade(unfinishedLessons);

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
        if (Array.isArray(res)) {
          sortLessons(res, "coach");
        } else {
          filterEnrollables(res.enrollable_lessons);
          sortLessons(res["lessons"], "student");
        }
      });
  };

  const enrollLesson = (body, lessonId) => {
    fetch(lessonToEditUrl(lessonId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        refreshLessons(body.lesson.student_id, "student");
        return response.json();
      }
      throw new Error("Network response was not ok.");
    });
  };

  const evaluateLesson = (body, lessonId, coachId) => {
    fetch(lessonToEditUrl(lessonId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        refreshLessons(coachId, "coach");
        return response.json();
      }
      throw new Error("Network response was not ok.");
    });
  };

  const createLesson = (body) => {
    fetch(`http://localhost:3000/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        refreshLessons(coachId, "coach");
        return response.json();
      }
      throw new Error("Network response was not ok.");
    });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Coaching-Site</Navbar.Brand>
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
          <EvaluatePage
            userId={user.id}
            lessonsToGrade={lessonsToGrade}
            evaluateLesson={evaluateLesson}
          />
        )}
        {page == "enroll" && (
          <EnrollPage
            userId={user.id}
            enrollableLessons={enrollableLessons}
            enrollLesson={enrollLesson}
          />
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
  );
}

export default App;
