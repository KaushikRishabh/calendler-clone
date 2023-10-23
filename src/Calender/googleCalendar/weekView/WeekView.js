import React, { useState } from "react";
import moment from "moment";
import AddEventModal from "./components/AddEventModal";
import WeekHeader from "./components/WeekHeader";
import TimeSlotGroup from "./components/TimeSlotGroup";
import "./styles.css";
import { Card, Col, Button, Nav, Row } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GetAllEvents } from "../../../../../api/events";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useBoundStore } from "../../../../../store/useBoundStore";
import { HashLoader } from "react-spinners";
// import AdminLogout from "../../../../../Common/AdminLogout";

function WeekView(props) {
  const token = localStorage.getItem("adminToken");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().startOf("day"));
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [eventsForThisSlot, setEventsForThisSlot] = useState([]);
  const adminID = useBoundStore((state) => state.adminID);
  const adminEmail = useBoundStore((state) => state.emailId);
  const [shwWrng, setShwWrng] = useState("none");
  const [errMssg, setErrMssg] = useState("");
  const navigate = useNavigate();
  // console.log("adminEmail", adminEmail);

  useEffect(() => {
    if (eventStart && eventEnd) {
      setShowAddEventModal(true);
    }
    getEventData();
  }, [eventStart, eventEnd]);

  useEffect(() => {
    getEventData();
  }, [startDate]);

  const getEventData = async () => {
    setLoading(true);
    // debugger;
    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(moment(startDate).add(7, "days"));
    // const url = `/interviewer/details/?start_datetime=2023-10-06T12:10:52Z&end_datetime=2023-10-11T12:10:52Z`;
    const url = `/interviewer/details/?start_datetime=${formattedStart}&end_datetime=${formattedEnd}`;
    const response = await GetAllEvents(url, token);
    const result = response?.data;
    if (response.success) {
      // console.log("event data", result);
      let modifiedResponse = modifyDates(result);
      // console.log("modifiedResponse", modifiedResponse);
      // setEventData(result?.data);
      const filteredResponse = modifiedResponse.data.filter((interview) => {
        return interview.recruiters.some(
          (recruiter) => recruiter.id === adminID
        );
      });

      modifiedResponse.data =
        adminEmail === "admin@gmail.com"
          ? modifiedResponse.data
          : filteredResponse;

      console.log("modifiedResponse", modifiedResponse);
      setEventData(modifiedResponse?.data);
      // const temp = result.data.map((item) => {
      // return {
      // id: item.applicantjobapply_id,
      // name: item.full_name,
      // };
      // });
      // setCandidateList(temp);
      setLoading(false);
    } else {
      // debugger;
      const error = response?.message;
      console.log("error -->", error);
      setLoading(false);
      if (error === "Request failed with status code 401") {
        setErrMssg("Session expired, please login again");
        handleErrAlert();
      }
    }
  };
  function formatDateTime(date) {
    // Convert the date to the required format
    const formattedDate = date.toISOString().split(".")[0] + "Z";
    return formattedDate;
  }

  function modifyDates(response) {
    return {
      ...response,
      data: response.data.map((item) => ({
        ...item,
        interview_date: adjustToUserTimezone(item.interview_date),
        interview_end_date: adjustToUserTimezone(item.interview_end_date),
      })),
    };
  }

  // function adjustToUserTimezone(isoDate) {
  //   const date = new Date(isoDate);
  //   const userTimezoneDate = new Date(date.toLocaleString());
  //   const timezoneOffset =
  //     date.getTimezoneOffset() - userTimezoneDate.getTimezoneOffset();
  //   return new Date(userTimezoneDate.getTime() - timezoneOffset * 60 * 1000);
  // }
  function adjustToUserTimezone(isoDate) {
    const date = moment.utc(isoDate);
    return date.local().toDate();
  }

  const goToNextWeek = () => {
    const dateAfter7Days = moment(startDate).add(7, "days");
    setStartDate(dateAfter7Days);
  };

  const goToPreviousWeek = () => {
    const dateBefore7Days = moment(startDate).subtract(7, "days");
    setStartDate(dateBefore7Days);
  };

  const goToToday = () => {
    setStartDate(moment().startOf("day"));
  };

  const openAddEventModal = (dateStamp, time, eventsForThisSlot) => {
    setEventsForThisSlot(eventsForThisSlot);
    // debugger;
    if (dateStamp && time !== undefined) {
      // const start = moment(dateStamp).set("hour", time);
      // const end = start.clone().add(1, "hour");
      const start = moment(dateStamp).set("hour", time).toDate();
      const end = moment(dateStamp)
        .set("hour", time + 1)
        .toDate();
      // console.log(
      //   "Setting eventStart:",
      //   start, //.format(),
      //   "eventEnd:",
      //   end //  .format()
      // );
      setEventStart(start);
      setEventEnd(end);
      // setShowAddEventModal(true);
    } else {
      // console.log("Setting eventStart:", start, "eventEnd:", end);
      setEventStart(
        //currentDate
        moment().startOf("day").toDate()
      );
      setEventEnd(
        //currentDate + 1 hour
        moment().startOf("day").add(1, "hour").toDate()
      );
      setShowAddEventModal(true);
    }
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = moment(startDate).add(i, "days");
    return {
      dateStamp: date.valueOf(),
      weekDayName: date.format("ddd"),
      date: date.format("D MMM"),
    };
  });
  const handleCloseModal = () => {
    setEventStart(null);
    setEventEnd(null);
    setShowAddEventModal(false);
  };
  const handleErrAlert = () => {
    document.body.style.overflow = "hidden";
    setShwWrng("block");
  };
  const handleShwWrng = () => {
    document.body.style.overflow = "auto";
    setShwWrng("none");
    // AdminLogout(navigate);
  };

  return (
    <>
      <Nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {/* <NavLink to="/Admin/SettingList" className="breadcrumb-item">
            Settings
          </NavLink> */}
          <NavLink
            to="/Admin/Calendar"
            className="breadcrumb-item"
            aria-current="page"
          >
            Calendar
          </NavLink>
        </ol>
      </Nav>
      <Card className="shadow mx-3 my-4 training_cls add_status">
        <Row className="cstm_table_frm mx-0">
          <Col md={6}>
            <div className="py-3 ">
              <h5 className="m-0 font-weight-bold text-primary">My Calendar</h5>
            </div>
          </Col>
          <Col md={6} className="text-end " style={{ paddingTop: "14px" }}>
            <Link
              title="Add New Event"
              className="cp-submit-btn tp8"
              onClick={openAddEventModal}
            >
              Add New Event
            </Link>
          </Col>
          {/* <Col md={6} className="text-end" style={{ paddingTop: "14px" }}></Col> */}
        </Row>
        <div>
          {showAddEventModal && (
            <AddEventModal
              show={showAddEventModal}
              onHide={handleCloseModal}
              eventStart={eventStart}
              eventEnd={eventEnd}
              // eventsForThisSlot={eventsForThisSlot}
              eventData={eventData}
              // onEventAdd={props.onNewEvent}
            />
          )}
          <div style={{ position: "relative" }}>
            {" "}
            {/* <-- Add this wrapper */}
            <div
              style={{
                display: "flex",
                flexDirection: "row", // <-- Change this to 'row'
                // justifyContent: "center",
                // alignItems: "center",
                gap: "20px",
                padding: "10px",
                position: "absolute", // <-- Absolute positioning
                left: "10%", // <-- Adjust this value as needed
                top: "-1.1%",
                transform: "translateY(-50%)", // Center vertically
              }}
            >
              <AiOutlineLeft
                size={30}
                onClick={goToPreviousWeek}
                style={{ cursor: "pointer", color: "#fff" }}
              />
              <Button
                onClick={goToToday}
                // style={{
                //   width: "70px",
                // }}
              >
                Today
              </Button>
              <AiOutlineRight
                size={30}
                onClick={goToNextWeek}
                style={{ cursor: "pointer", color: "#fff" }}
              />
            </div>
            <Row>
              <WeekHeader weekDays={weekDays} />
              {Array.from({ length: 24 }).map((_, hour) => (
                <TimeSlotGroup
                  key={hour}
                  time={hour}
                  eventData={eventData}
                  getEventData={getEventData}
                  weekDays={weekDays}
                  openAddEventModal={openAddEventModal}
                  // events={props.events}
                  // onEventUpdate={props.onEventUpdate}
                  // onEventDelete={props.onEventDelete}
                />
              ))}
            </Row>
          </div>
        </div>
      </Card>
      {/* Success and Error Modals */}
      <div className="sweet-overlay" style={{ display: shwWrng }}>
        <div className="sweet-alert">
          <div className="err-icon">
            <span className="err-body pulseWarningIns"></span>
            <span className="err-dot pulseWarningIns"></span>
          </div>
          <h2>Not allowed !</h2>
          <p style={{ display: "block" }}>{errMssg}</p>
          <Button className="sweet-btn" onClick={() => handleShwWrng()}>
            Ok
          </Button>
        </div>
      </div>

      {loading && (
        <div className="loader">
          <HashLoader color="#fff" loading={loading} size={140} />
          <br />
          <br />
          <h4 style={{ color: "#fff" }}>Loading...</h4>
        </div>
      )}
    </>
  );
}

export default WeekView;
