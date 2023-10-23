import React from "react";
import { Row, Col } from "react-bootstrap";
import TimeSlot from "./TimeSlot";

function TimeSlotGroup(props) {
  // console.log("props", props);
  return (
    <Row
    // style={{ border: "1px solid red" }}
    >
      <Col
        style={{
          // border: "1px solid red", //#eaeaea
          marginTop: "20px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // cursor: "pointer",
          // backgroundColor: "#f2f2f2", // Highlight today's column
        }}
        xs={1}
        // className="text-right pr-0"
      >
        {props.time}:00
      </Col>
      {props.weekDays.map((day) => (
        <TimeSlot
          key={day.dateStamp}
          dateStamp={day.dateStamp}
          getEventData={props.getEventData}
          time={props.time}
          eventData={props.eventData}
          openAddEventModal={props.openAddEventModal}
          events={props.events}
          // onEventUpdate={props.onEventUpdate}
          // onEventDelete={props.onEventDelete}
        />
      ))}
    </Row>
  );
}

export default TimeSlotGroup;
