import React, { useState } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { timeTranslator } from "./Tools";

const EnrollPage = ({ userId, enrollableLessons, enrollLesson }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState();
  const handleClose = () => setShowEditModal(false);

  const lessonEditModal = (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enroll in this lesson?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {lessonToEdit && (
          <>
            <h5>Enroll and share your phone number with the coach</h5>

            <Card className="mt-3" style={{ backgroundColor: "#bee8e7" }}>
              <Card.Body>
                <Card.Title>{lessonToEdit.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {lessonToEdit.date + " " + timeTranslator[lessonToEdit.time]}
                </Card.Subtitle>
                <div>
                  <p className="mb-0">{`Coach: ${lessonToEdit.coach.firstName} ${lessonToEdit.coach.lastName}`}</p>
                  <p>{`Coach Introduction: ${lessonToEdit.coach.introduction}`}</p>
                  <p>{lessonToEdit.description}</p>
                </div>
              </Card.Body>
            </Card>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            enrollLesson(
              {
                lesson: {
                  student_id: userId,
                },
              },
              `${lessonToEdit.id}`
            );
            handleClose();
          }}>
          Enroll
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="mb-5 pt-3">
            <h3>Enroll in a new lesson</h3>
            <div>
              {enrollableLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="mt-3"
                  style={{ width: "40vw", backgroundColor: "#bee8e7" }}
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
                      <p className="mb-0">{`Coach: ${lesson.coach.firstName} ${lesson.coach.lastName}`}</p>
                      <p>{`Coach Introduction: ${lesson.coach.introduction}`}</p>
                      <p>{lesson.description}</p>
                      {lesson.coach && (
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
      {lessonEditModal}
    </Container>
  );
};

export default EnrollPage;
