import React, { useState } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { timeTranslator } from "./Tools";

const EvaluatePage = ({ userId, lessonsToGrade, evaluateLesson }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState();

  const [score, setScore] = useState();
  const [notes, setNotes] = useState();

  const lessonEditModal = (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>How was the lesson?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {lessonToEdit && (
          <>
            <h5>Leave a review for the lesson:</h5>

            <Card className="mt-3" style={{ backgroundColor: "#a5e8b7" }}>
              <Card.Body>
                <Card.Title>{lessonToEdit.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {lessonToEdit.date + " " + timeTranslator[lessonToEdit.time]}
                </Card.Subtitle>
                <div>
                  <p>{lessonToEdit.description}</p>
                </div>
              </Card.Body>
            </Card>

            <Form.Label className="mt-5">Score:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Rate the lesson from 1-5!"
              value={score}
              max={5}
              min={1}
              onChange={(e) => setScore(e.target.value)}
            />

            <Form.Label className="mt-4">Notes:</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows="7"
              placeholder="Describe how your lesson went"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            evaluateLesson(
              {
                lesson: {
                  score,
                  notes,
                },
              },
              `${lessonToEdit.id}`,
              userId
            );
            setShowEditModal(false);
          }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="mb-5">
            <h3>Lessons To Evaluate</h3>
            <div>
              {lessonsToGrade.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="mt-3"
                  style={{ width: "33vw", backgroundColor: "#a5e8b7" }}
                  onClick={() => {
                    setLessonToEdit(lesson);
                    setShowEditModal(true);
                  }}>
                  <Card.Body>
                    <Card.Title>{lesson.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {lesson.date + " " + timeTranslator[lesson.time]}
                    </Card.Subtitle>
                    <div>
                      <p>{lesson.description}</p>
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
      {lessonEditModal}
    </Container>
  );
};

export default EvaluatePage;
