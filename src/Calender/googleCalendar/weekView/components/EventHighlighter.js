import React, { useState } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { eventHighlighterStyle } from "../styles";
import moment from "moment";
import EditEventModal from "./EditEventModal";

function EventHighlighter({
  eventsForThisSlot,
  getEventData,
  singleEvent,
  eventData,
}) {
  // if (eventsForThisSlot) console.log("eventsForThisSlot", eventsForThisSlot);
  const [showEditEventModal, setShowEditEventModal] = useState(false);

  // const handleEventClick = (event, e) => {
  //   // Logic to handle event click, l
  //   debugger;
  //   e.stopPropagation();
  //   // ike opening an edit modal
  //   // console.log("eventsForThisSlot", eventsForThisSlot);
  //   setShowEditEventModal(true);
  // };
  const handleEventClick = (event, e) => {
    if (e.target !== e.currentTarget) return; // Check if the click was directly on the EventHighlighter div
    setShowEditEventModal(true);
  };

  const handleEventUpdate = (updatedEvent) => {
    // debugger;
    setShowEditEventModal(false);
  };

  const trimmedTitle = (title) => {
    const trimTo = eventsForThisSlot.length > 2 ? 2 : 6;
    return title?.length > trimTo ? title.substring(0, trimTo) : title;
  };

  const handleEventDelete = () => {
    setShowEditEventModal(false);
  };
  const calculateWidth = () => {
    let width = 80;
    width = width / eventsForThisSlot.length;
    return width + "%";
    // return 80 + "%";
  };

  return (
    <div
      onClick={(e) => {
        // e.stopPropagation(); // Prevent the Col's onClick from being triggered
        handleEventClick(singleEvent, e);
      }}
      title={singleEvent?.interview_title}
      style={{
        width: calculateWidth(), // "20%",
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
      {trimmedTitle(singleEvent?.interview_title)}

      {showEditEventModal && (
        <EditEventModal
          getEventData={getEventData}
          show={showEditEventModal}
          eventData={eventData}
          eventsForThisSlot={eventsForThisSlot}
          singleEvent={singleEvent}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
          onClose={(e) => {
            setShowEditEventModal(false);
          }}
        />
      )}
    </div>
  );
}

export default EventHighlighter;
