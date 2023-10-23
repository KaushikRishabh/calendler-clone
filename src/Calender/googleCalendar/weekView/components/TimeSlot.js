import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { isToday } from "../../utils";
import EventHighlighter from "./EventHighlighter";
import dummyData2 from "../../dummyData";
import { GetAllEvents } from "../../../../../../api/events";
import { useBoundStore } from "../../../../../../store/useBoundStore";
// import { GetAllEvents } from "../../../../../../api/events,js";

function TimeSlot(props) {
  const isTodayColumn = isToday(props.dateStamp);

  // debugger;
  // Convert dateStamp and time to a Date object in local time
  const localDate = new Date(props.dateStamp);
  localDate.setHours(props.time, 0, 0, 0);

  // Convert local time to UTC
  const timeSlotStart = localDate.getTime();
  const timeSlotEnd = timeSlotStart + 3600000; // 1 hour duration for each slot
  // debugger;
  const eventsForThisSlot = props?.eventData?.filter((event) => {
    // debugger;
    const eventStart = new Date(event.interview_date).getTime();
    const eventEnd = new Date(event.interview_end_date).getTime();
    return eventStart < timeSlotEnd && eventEnd > timeSlotStart;
  });
  // const eventsForThisSlotDummy = dummyData2.filter((event) => {
  //   // ((event) => {

  //   const eventStart = new Date(event.interview_date).getTime();
  //   const eventEnd = new Date(event.interview_end_date).getTime();
  //   return eventStart < timeSlotEnd && eventEnd > timeSlotStart;
  // });
  // if (eventsForThisSlot.length)
  // console.log("eventsForThisSlot: " + timeSlotStart, eventsForThisSlot);
  // console.log("eventData", props.eventData);
  let count = 0;

  useEffect(() => {
    count++;
    // console.log("count", count);
    // debugger;
    // getEventData();
  }, []);

  const openEditEventModal = (event, e) => {
    // e.stopPropagation();
    // debugger;
    if (eventsForThisSlot.length === 0 || e.target === e.currentTarget) {
      props.openAddEventModal(props.dateStamp, props.time);
    }
    // Logic to open the modal with event data filled in for editing
  };
  const trimmedTitle = (title) => {
    return title.length > 15 ? title.substring(0, 15) + "..." : title;
  };

  return (
    <Col
      className="calender-col"
      style={{
        border: "1px solid #eaeaea",
        height: "60px",
        cursor: "pointer",
        backgroundColor: isTodayColumn ? "#d9d9d9" : "white",
      }}
      onClick={(e) => {
        if (eventsForThisSlot.length === 0 || e.target === e.currentTarget) {
          props.openAddEventModal(
            props.dateStamp,
            props.time,
            props?.eventData
          );
        }
      }}
    >
      {eventsForThisSlot?.length > 0 && (
        <>
          {eventsForThisSlot.map((event, index) => {
            return (
              <EventHighlighter
                key={index}
                getEventData={props.getEventData}
                eventsForThisSlot={eventsForThisSlot}
                singleEvent={event}
                eventData={props.eventData}
              />
            );
          })}
          {/* <EventHighlighter
            getEventData={props.getEventData}
            eventsForThisSlot={eventsForThisSlot}

            // trimmedTitle={trimmedTitle}
          />
          */}
          {/* <div
            onClick={(e) => {
              console.log("lengh", eventsForThisSlot.length);
              e.stopPropagation(); // Prevent the Col's onClick from being triggered
              openEditEventModal(eventsForThisSlot[0], e);
            }}
            style={{
              width: "80%",
              height: "90%",
              float: "left",
              backgroundColor: "#a9a9a9", //#198754
              padding: "2px",
              border: "1px solid #d3d3d3",
              borderRadius: "5px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {trimmedTitle(eventsForThisSlot[0].interview_title)}
          </div> */}
        </>
      )}
    </Col>
  );
}

export default TimeSlot;
