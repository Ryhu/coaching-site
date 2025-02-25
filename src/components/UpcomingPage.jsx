import React from "react";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { timeTranslator } from "./Tools";

const UpcomingPage = ({ userType, upcomingLessons }) => {
  return (
    <Container className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="mb-5">
            <h3>Upcoming Lessons</h3>
            <div>
              {(upcomingLessons || []).map((lesson) => (
                <Card
                  className="mt-3"
                  key={lesson.id}
                  style={{ width: "33vw", backgroundColor: "#bee8e7" }}>
                  <Card.Body>
                    <Card.Title>{lesson.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {lesson.date + " " + timeTranslator[lesson.time]}
                    </Card.Subtitle>
                    <div>
                      <p>{lesson.description}</p>
                      {userType === "coach" && lesson.student && (
                        <>
                          <p>
                            {`Student: ${lesson.student.first_name} ${lesson.student.last_name}`}
                          </p>

                          <p>{`Student's phone number: ${lesson.student.phone}`}</p>
                        </>
                      )}
                      {userType === "student" && (
                        <>
                          <p>
                            {`Coach: ${lesson.coach.first_name} ${lesson.coach.last_name}`}
                          </p>

                          <p>{`Coach's phone number: ${lesson.coach.phone}`}</p>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UpcomingPage;
