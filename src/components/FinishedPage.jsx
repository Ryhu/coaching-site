import React, { useState, useEffect } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { timeTranslator } from "./Tools";

const FinishedPage = ({ userType, finishedLessons }) => {
  return (
    <Container className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="mb-5">
            <h3>Past Lessons</h3>
            <div>
              {finishedLessons.map((lesson) => (
                <Card
                  className="mt-3"
                  key={lesson.id}
                  style={{ width: "33vw", backgroundColor: "#f5d0d1" }}>
                  <Card.Body>
                    <Card.Title>{lesson.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {lesson.date + " " + timeTranslator[lesson.time]}
                    </Card.Subtitle>
                    <div>
                      <p>{lesson.description}</p>
                      <p>Score: {lesson.score}</p>
                      <p>Notes: {lesson.notes}</p>
                      {lesson.student && (
                        <>
                          <p>
                            {`Student: ${lesson.student.first_name} ${lesson.student.last_name}`}
                          </p>

                          <p>{`Student's phone number: ${lesson.student.phone}`}</p>
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

export default FinishedPage;
