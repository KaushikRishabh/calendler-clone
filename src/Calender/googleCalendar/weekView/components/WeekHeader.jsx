import React from "react";
import { Row, Col } from "react-bootstrap";
import { isToday } from "../../utils";
import EventHighlighter from "./EventHighlighter";

function WeekHeader(props) {
  // const isTodayColumn = isToday(day.dateStamp);
  return (
    <Row>
      <Col xs={1} style={{ padding: 0 }}>
        {" "}
        {/* Empty column to align with time column */}
      </Col>
      {props.weekDays.map((day) => (
        <Col
          key={day.dateStamp}
          style={{
            color: "#05164d",
            fontSize: "14px",
            fontWeight: isToday(day.dateStamp) ? "bold" : "500",
          }}
        >
          <p>{day.weekDayName}</p>
          <p>{day.date}</p>
        </Col>
      ))}
    </Row>
  );
}

export default WeekHeader;
