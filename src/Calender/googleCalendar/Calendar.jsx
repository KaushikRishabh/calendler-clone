import React, { useState, useEffect } from "react";
import WeekView from "./weekView/WeekView";
import CalendarEventHandler from "./calendarEventHandler";
import dummyData2 from "./dummyData";
import { Card, Col, Nav, Row } from "react-bootstrap";
import {
  // useNavigate
  Link,
  NavLink,
} from "react-router-dom";

function Calendar() {
  // const [events, setEvents] = useState(
  //   JSON.parse(localStorage.getItem("events")) || {}
  // );
  const [events, setEvents] = useState(dummyData2);
  const token = localStorage.getItem("adminToken");
  // const navigate = useNavigate();

  useEffect(() => {
    // debugger;
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      // navigate("/Admin/Account");
    }
  }, []);
  // useEffect(() => {
  //   debugger;
  //   const saveEventsToLocal = () => {
  //     localStorage.setItem("events", JSON.stringify(events));
  //   };

  //   window.addEventListener("beforeunload", saveEventsToLocal);

  //   return () => {
  //     window.removeEventListener("beforeunload", saveEventsToLocal);
  //   };
  // }, [events]);

  // const addNewEvent = (event) => {
  //   event = {
  //     ...event,
  //     id: CalendarEventHandler.generateId(event),
  //   };
  //   setEvents((prevEvents) => CalendarEventHandler.add(prevEvents, event));
  // };

  // const updateEvent = (eventId, updatedEvent) => {
  //   setEvents((prevEvents) =>
  //     CalendarEventHandler.update(eventId, updatedEvent, prevEvents)
  //   );
  // };

  // const deleteEvent = (eventId) => {
  //   setEvents((prevEvents) => CalendarEventHandler.delete(eventId, prevEvents));
  // };

  return (
    // <>
    //   <Nav aria-label="breadcrumb">
    //     <ol className="breadcrumb">
    //       {/* <NavLink to="/Admin/SettingList" className="breadcrumb-item">
    //         Settings
    //       </NavLink> */}
    //       <NavLink
    //         to="/Admin/Calendar"
    //         className="breadcrumb-item"
    //         aria-current="page"
    //       >
    //         Calendar
    //       </NavLink>
    //     </ol>
    //   </Nav>
    //   <Card className="shadow mx-3 my-4 training_cls add_status">
    //     <Row className="cstm_table_frm mx-0">
    //       <Col md={6}>
    //         <div className="py-3">
    //           <h5 className="m-0 font-weight-bold text-primary">Status</h5>
    //         </div>
    //       </Col>
    //       <Col md={6} className="text-end" style={{ paddingTop: "14px" }}>
    //         <Link
    //           title="Add Status"
    //           className="cp-submit-btn tp8"
    //           onClick={openAddEventModal}
    //         >
    //           Add New Event
    //         </Link>
    //       </Col>
    //       {/* <Col md={6} className="text-end" style={{ paddingTop: "14px" }}></Col> */}
    //     </Row>
    <WeekView
    // events={events}
    // onNewEvent={addNewEvent}
    // onEventUpdate={updateEvent}
    // onEventDelete={deleteEvent}
    />
    //   </Card>
    // </>
  );
}

export default Calendar;
