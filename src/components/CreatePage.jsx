import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Container, Button, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { timeTranslator } from "./Tools";

const CreatePage = ({
  setPage,
  userId: coachId,
  allLessons,
  refreshLessons,
}) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const [bookedTimesForDate, setBookedTimesForDate] = useState();

  const [blacklist, setBlacklist] = useState([]);

  const updateBlacklist = (value) => {
    setBlacklist(
      bookedTimesForDate[value.toLocaleString().split(",")[0]] || []
    );
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

  useEffect(() => {
    let dateDic = {};
    allLessons.forEach((lesson) => {
      if (dateDic[lesson.date]) {
        dateDic[lesson.date].push(lesson.time);
      } else {
        dateDic[lesson.date] = [lesson.time];
      }
    });

    setBookedTimesForDate(dateDic);
  }, []);

  const placeHolderText = (text) => (
    <span style={{ color: "#A9A9AC", fontStyle: "italic" }}>{text}</span>
  );

  const radioLabel = (disabledBool, time, timeText) => {
    return (
      <label className={`timeRadioLabel ${disabledBool && "disabled"}`}>
        <input
          className="me-2"
          type="radio"
          name="name"
          onClick={() => setTime(time)}
          disabled={disabledBool}
        />
        {timeText}
      </label>
    );
  };

  return (
    <Container>
      <h2 className="mt-3">Create a new lesson</h2>

      <div className="d-flex mt-5 flex-row justify-content-center">
        <Card
          style={{
            minWidth: "27rem",
            maxWidth: "80vw",
            backgroundColor: "#bee8e7",
          }}>
          <Card.Body>
            <Card.Title>
              {title || placeHolderText("Title goes here")}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Set to happen on {date} at {timeTranslator[time]}
            </Card.Subtitle>
            <Card.Text>
              {description || placeHolderText("Description goes here")}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="d-flex flex-row justify-content-around mt-5">
        <Calendar
          calendarType="gregory"
          onChange={(value) => {
            setDate(value.toLocaleString().split(",")[0]);
            updateBlacklist(value);
          }}
          value={date}
        />

        <div className="d-flex flex-column">
          Times Available:
          {radioLabel(blacklist.includes(8), 8, "8:00 AM - 10:00 AM")}
          {radioLabel(blacklist.includes(10), 10, "10:00 AM - 12:00 PM")}
          {radioLabel(blacklist.includes(12), 12, "12:00 PM - 2:00 PM")}
          {radioLabel(blacklist.includes(14), 14, "2:00 PM - 4:00 PM")}
          {radioLabel(blacklist.includes(16), 16, "4:00 PM - 6:00 PM")}
        </div>

        <div style={{ width: "25vw" }}>
          <Form.Label>Lesson Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title goes here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Form.Label className="mt-4">Lesson Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows="7"
            placeholder="Describe your lesson here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex mt-4 flex-row justify-content-end">
        <Button
          disabled={
            title === undefined || time === undefined || date === undefined
          }
          onClick={() => {
            createLesson({ title, time, date, description, coach_id: coachId });
            setPage("lessons");
          }}>
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default CreatePage;
