import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const LoginPage = ({ updateUser }) => {
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/coaches")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        setCoaches(res);
      });

    fetch("http://localhost:3000/students")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        console.log("students are", res);
        setStudents(res);
      });
  }, []);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>Switch Users</h1>
        <h5>click on a user to switch to that user</h5>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column me-2">
            {coaches.map((coach) => {
              return (
                <div
                  onClick={() => updateUser(coach, "coach")}
                  key={coach.id + "c"}>
                  <UserCard user={coach} type="coach" />
                </div>
              );
            })}
          </div>

          <div className="d-flex flex-column">
            {students.map((student) => {
              return (
                <div
                  onClick={() => updateUser(student, "student")}
                  key={student.id + "s"}>
                  <UserCard user={student} type="student" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
