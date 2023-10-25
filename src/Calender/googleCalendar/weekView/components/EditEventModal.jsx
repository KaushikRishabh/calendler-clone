import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles.css";
// import { GetAllMemberDetails } from "../../../../../../api/memberSearch";
// import { GetAllHiringLead } from "../../../../../../api/adminDetails";
// import AdminLogout from "../../../../../../Common/AdminLogout";
// import { useNavigate } from "react-router-dom";
// import MultiDropdown from "../../../../../../Common/Multidropdown";
// import DropDown from "../../../../../../Common/dropdown";
import axios from "axios";
import { HashLoader } from "react-spinners";
import e from "cors";

function EditEventModal({
  show,
  // eventsForThisSlot,
  eventData,
  singleEvent,
  onUpdate,
  onDelete,
  onClose,
  getEventData,
}) {
  // console.log("show ", show);
  // console.log("eventsForThisSlot", eventsForThisSlot);
  const firstEvent = singleEvent;
  // console.log("firstEvent", firstEvent);
  const token = localStorage.getItem("adminToken");
  const [loading, setLoading] = useState(false);
  const [shwWrng, setShwWrng] = useState("none");
  const [errMssg, setErrMssg] = useState("");
  const [shwSccs, setShwSccs] = useState("none");
  const [sccsHead, setSccsHead] = useState("");
  const [sccsMsg, setSccsMsg] = useState("");
  const [mltHead, setMltHead] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [shwDlt, setShwDlt] = useState("none");
  const [recruiter, setRecruiter] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [recruiterPayload, setRecruiterPayload] = useState([]);
  const [CandidateDropdown, setCandidateDropdown] = useState("");
  const [CandidateList, setCandidateList] = useState();
  const [DateStart, setDateStart] = React.useState(null);
  const [DateEnd, setDateEnd] = React.useState(null);
  // const navigate = useNavigate();
  const [startDatePickerValue, setStartDatePickerValue] = useState(null);
  const [endDatePickerValue, setEndDatePickerValue] = useState(null);
  const [recruiterForThisSlot, setRecruiterForThisSlot] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const originalDateTime = {
    start: firstEvent?.interview_date,
    end: firstEvent?.interview_end_date,
  };
  // console.log("firstEvent", firstEvent);
  useEffect(() => {
    // if (isDataLoaded) {
    // debugger;
    // if (startDatePickerValue && endDatePickerValue && isDataLoaded) {
    // console.log("ueh 4");
    // debugger;
    // if (adminData.length > 0) {
    //   let dataArr = determineBusyRecruiters(adminData);
    //   setAdminData(adminData);
    // }
    getHiringLeadData();

    // } // }
  }, [startDatePickerValue, endDatePickerValue]);
  useEffect(() => {
    // getEventData();
    getMemberData();
    // getHiringLeadData();

    // return (cleanUp = () => {});
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      start: firstEvent?.interview_date || null, // || new Date(),
      end: firstEvent?.interview_end_date || null, // || new Date(),
      Recruiter: "",
      Candidate: "",
      description: "",
      url: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      start: Yup.date()
        .nullable()
        // .test("is-valid-date", "Start date is required", (value) => {
        //   return !isNaN(value);
        // })
        .required("Start date is required"),
      end: Yup.date()
        .nullable()
        // .test("is-valid-date", "End date is required", (value) => {
        //   return !isNaN(value);
        // })
        .required("End date is required")
        .min(Yup.ref("start"), "End date should be after start date"),
      Recruiter: Yup.array()
        .min(1, "Recruiter field is required.")
        .required("Recruiter field is required."),
      Candidate: Yup.string().required("Candidate field is required."),
      description: Yup.string().required().max(1500, "Description too long!"), // Example validation
      url: Yup.string().matches(
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
        "Invalid URL format"
      ),
    }),
    onSubmit: (values) => {
      // debugger;
      console.log("values", values);
      const formattedStart = formatDateTime(values.start);
      const formattedEnd = formatDateTime(values.end);

      //check if any id of recruiterpaylod is present in recruiterForThisSlot
      let repeatedRecruiter = [];
      for (let i = 0; i < recruiterForThisSlot.length; i++) {
        for (let j = 0; j < recruiterPayload.length; j++) {
          if (recruiterForThisSlot[i].id === recruiterPayload[j]) {
            repeatedRecruiter.push(recruiterForThisSlot[i].name);
          }
        }
      }
      console.log("repeated recruiter", repeatedRecruiter);

      if (repeatedRecruiter.length > 0)
        setMltHead(
          repeatedRecruiter.join(", ") +
            " already have an event scheduled for this slot. Do you want proceed?"
        );
      else updateEvent(values);
      // props.onEventAdd(values);
    },
  });

  let eventsForThisSlot;
  useEffect(() => {
    eventsForThisSlot = eventData?.filter((event) => {
      // debugger;
      // console.log("startDatePickerValue", startDatePickerValue.getTime());

      const eventStart = new Date(event.interview_date).getTime();
      // console.log("eventStart", eventStart);
      const eventEnd = new Date(event.interview_end_date).getTime();
      // debugger;

      //include events when:

      const includedEvents =
        (eventStart <= startDatePickerValue?.getTime() && // eS: 3 sDP: 1-2
          eventEnd >= endDatePickerValue?.getTime()) ||
        (eventStart >= startDatePickerValue?.getTime() &&
          eventEnd <= endDatePickerValue?.getTime()) ||
        (eventStart >= startDatePickerValue?.getTime() &&
          eventStart <= endDatePickerValue?.getTime()) ||
        (eventEnd >= startDatePickerValue?.getTime() &&
          eventEnd <= endDatePickerValue?.getTime());

      // debugger;
      return includedEvents;
    });
    // console.log("eventsForThisSlot", eventsForThisSlot);

    // find if any event has recruiter with id in recruiterPayload
    // const recrForThisSlot = [];
    // eventsForThisSlot.map((event) => {
    //   event.recruiters.map((item) => {
    //     // debugger;
    //     const recruiterExists = recrForThisSlot.some(
    //       (recruiter) => recruiter.id === item.id
    //     );
    //     if (!recruiterExists) {
    //       recrForThisSlot.push({ ...item, is_busy: true });
    //     }
    //   });
    // });
    // setRecruiterForThisSlot(recrForThisSlot);
    // let tempArr = adminData;
    // console.log("recrForThisSlot", recrForThisSlot);

    // tempArr = tempArr.map((item) => {
    //   // debugger;
    //   item = { ...item, is_busy: false };

    //   return item;
    // });

    //updating adminData

    // tempArr = tempArr.map((item) => {
    //   // debugger;
    //   recrForThisSlot.map((recruiter) => {
    //     if (item.id === recruiter.id) {
    //       // debugger;
    //       item = { ...item, is_busy: recruiter.is_busy };
    //       console.log("item", item);

    //       return item;
    //     } else {
    //       // if (recruiter.id === 772) debugger;
    //       item = { ...item, is_busy: false };

    //       return item;
    //     }
    //   });
    //   return item;
    // });
    // console.log("tempArr", tempArr);
    // debugger;

    // setAdminData(tempArr);
  }, [startDatePickerValue, endDatePickerValue]);
  const determineBusyRecruiters = (dataArr) => {
    if (!startDatePickerValue || !endDatePickerValue) return [];

    const recrForThisSlot = [];

    dataArr.forEach((item) => {
      // if (item.id === 772 || item.id === 969 || item.id === 797) debugger;

      item?.interview_schedule.forEach((schedule) => {
        // if (item?.id === 772) debugger;
        const recruiterIsBusy =
          (new Date(schedule.interview_start_date).getTime() ==
            startDatePickerValue?.getTime() &&
            new Date(schedule.interview_end_date).getTime() ==
              endDatePickerValue?.getTime()) ||
          (new Date(schedule.interview_start_date).getTime() >
            startDatePickerValue?.getTime() &&
            new Date(schedule.interview_end_date).getTime() <
              endDatePickerValue?.getTime()) ||
          (new Date(schedule.interview_start_date).getTime() >
            startDatePickerValue?.getTime() &&
            new Date(schedule.interview_start_date).getTime() <
              endDatePickerValue?.getTime()) ||
          (new Date(schedule.interview_end_date).getTime() >
            startDatePickerValue?.getTime() &&
            new Date(schedule.interview_end_date).getTime() <
              endDatePickerValue?.getTime()) ||
          (new Date(schedule.interview_start_date).getTime() <
            startDatePickerValue?.getTime() &&
            new Date(schedule.interview_end_date).getTime() >
              endDatePickerValue?.getTime());
        if (recruiterIsBusy) {
          // debugger;
          // const selectedEvent = eventsForThisSlot.find(
          //   (event) => event.id === firstEvent.id
          // );
          // if (selectedEvent.id !== firstEvent.id) {
          //   // debugger;
          //   recrForThisSlot.push({ ...item, is_busy: true });
          // } else {
          //code to push unique recruiter only
          if (!recrForThisSlot.some((recruiter) => recruiter.id === item.id)) {
            recrForThisSlot.push({ ...item, is_busy: true });
          }

          // recrForThisSlot.push({ ...item, is_busy: true });
          // }
        }
      });
    });

    console.log("recrForThisSlot", recrForThisSlot);
    console.log("eventsForThisSlot", eventsForThisSlot);

    let tempArr = dataArr.map((item) => {
      // if (item.id === 772) debugger;
      const isBusy = recrForThisSlot.some(
        (recruiter) => recruiter.id === item.id
      );
      return { ...item, is_busy: isBusy };
    });
    // console.log("admin data tempArr", tempArr);
    setRecruiterForThisSlot(recrForThisSlot);
    // debugger;
    // setAdminData(tempArr);

    let tempRecArr = [];
    if (recruiter.length > 0) {
      tempRecArr = recruiter.map((selectedRec) => {
        tempArr.map((item) => {
          if (selectedRec?.id === item?.id) {
            // handleMultiDropdown(item);
            selectedRec.is_busy = item?.is_busy;
          }
        });
        return selectedRec;
      });
      // debugger;
      console.log("setting rec 1", tempRecArr);
      setRecruiter(tempRecArr);
    }
    return tempArr;
  };

  // useEffect(() => {
  //   // console.log("adminDATAA", adminData);
  //   if (adminData.length > 0) determineBusyRecruiters();
  // }, [startDatePickerValue, endDatePickerValue, eventData]);

  // useEffect(() => {
  //   let tempRecArr = [];
  //   if (recruiter.length > 0) {
  //     tempRecArr = recruiter.map((selectedRec) => {
  //       adminData.map((item) => {
  //         if (selectedRec?.id === item?.id) {
  //           // handleMultiDropdown(item);
  //           selectedRec.is_busy = item?.is_busy;
  //         }
  //       });
  //       return selectedRec;
  //       // if (selectedRec.id === item.id) handleMultiDropdown(item);
  //     });
  //     // debugger;
  //     setRecruiter(tempRecArr);
  //   }
  //   // console.log("recruiter", tempRecArr);
  // }, [adminData]);
  useEffect(() => {
    // if (adminData.length > 0) {
    // Pre-populate the form fields with the existing event data
    if (!isDataLoaded) {
      let rctrId = firstEvent?.recruiters.map((item) => {
        return item.id;
      });
      let rctrArr = firstEvent?.recruiters;
      // debugger;
      if (eventsForThisSlot) {
        formik.setValues({
          title: firstEvent?.interview_title,
          start: firstEvent?.interview_date,
          end: firstEvent?.interview_end_date,

          description: firstEvent?.interview_description,
          url: firstEvent?.interview_url,
          Recruiter: rctrId,
          Candidate: firstEvent?.candidate_info?.id,
        });
      }
      // debugger;
      setRecruiterPayload(rctrId);
      console.log("setting rec 2", rctrArr);
      setRecruiter(rctrArr);
      setCandidateDropdown(
        firstEvent?.candidate_info?.name +
          " - " +
          firstEvent?.job_info?.posting_title
      );
      // formik.setFieldValue("Recruiter", rctrId);
      setStartDatePickerValue(firstEvent?.interview_date);
      setEndDatePickerValue(firstEvent?.interview_end_date);
      setIsDataLoaded(true);
    }
    // setIsDataLoaded(true);
    // }
  }, [eventsForThisSlot, adminData]);

  const getMemberData = async () => {
    const url = `/get/all/member/detail/?is_event=true`;
    const response = await GetAllMemberDetails(url, token);
    const result = response?.data;
    if (response.success) {
      // console.log("cand result", result);
      const temp = result.data.map((item) => {
        return {
          id: item.applicantjobapply_id,
          name: item.full_name + " - " + item.job_title,
        };
      });
      setCandidateList(temp);
    } else {
      const error = response?.message;
      console.log("error -->", error);
      setLoading(false);
      if (error?.response?.data?.status === "401") {
        setErrMssg("Session expired, please login again");
        handleErrAlert();
      }
    }
  };
  const getHiringLeadData = async () => {
    // debugger;
    // setIsDataLoaded(false);
    // if (adminData.length > 0) {
    //   return;
    // }
    // const url = `/view/all/hiring/lead/detail/`;
    // const response = await GetAllHiringLead(url, token);
    // const result = response?.data;
    // if (response.success) {
    //   // // console.log("result", result);
    //   let temp = result.data.map((item) => {
    //     return {
    //       id: item.id,
    //       name: item.full_name,
    //       is_busy: false,
    //       interview_schedule: item.interview_schedule,
    //     };
    //   });
    //   temp = determineBusyRecruiters(temp);
    //   // debugger;
    //   // console.log("adminData from hiring lead api", temp);
    //   // if (!isDataLoaded)
    //   // debugger;
    //   if (temp.length > 0) {
    //     // console.log("temp admin", temp);
    //     setAdminData(temp);
    //   }
    //   // console.log("getHiringLeadData");
    //   // setIsDataLoaded(true);
    // } else {
    //   const error = response?.message;
    //   // console.log("error -->", error);
    //   setLoading(false);
    //   if (error?.response?.data?.status === "401") {
    //     setErrMssg("Session expired, please login again");
    //     handleErrAlert();
    //   }
    // }
  };

  const handleErrAlert = () => {
    document.body.style.overflow = "hidden";
    setShwWrng("block");
  };
  const handleShwSccs = () => {
    document.body.style.overflow = "auto";
    // navigate("/Admin/Calendar");
    setShwSccs("none");
    formik.resetForm();
    handleModalClose();
    getEventData();
  };
  const handleShwWrng = () => {
    document.body.style.overflow = "auto";
    setShwWrng("none");
    // AdminLogout(navigate);
  };
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // debugger;
    setShwDlt("block");
    setErrMssg("You will not be able to recover this event!");
    setDeleteID(firstEvent?.id);
  };
  const handleCfmDlt = async () => {
    let result;
    setShwDlt("none");
    setLoading(true);
    try {
      const response = await axios({
        headers: { Authorization: `Bearer ${token}` },
        method: "delete",
        url: `/cancel/interview/${deleteID}/`,
      });
      result = response;
    } catch (error) {
      setLoading(false);
      console.log("error -->", error);
    }
    if (result?.status === 200) {
      setLoading(false);
      setSccsMsg("Event deleted successfully !");

      setShwSccs("block");
      setSccsHead("Success !");
    }
  };
  const cancelDlt = () => {
    document.body.style.overflow = "auto";
    setShwDlt("none");
  };

  const updateEvent = async (values) => {
    setLoading(true);
    // debugger;
    //Api call to post template data
    // Check if the start or end date-time has changed
    const isRescheduled =
      values?.start !== originalDateTime.start ||
      values?.end !== originalDateTime.end;
    // console.log("isRescheduled", isRescheduled);
    // return;
    const formattedStart = formatDateTime(values.start);
    const formattedEnd = formatDateTime(values.end);
    const formData = new FormData();
    formData.append("interview_title", values.title);
    formData.append("candidate", values?.Candidate);
    formData.append("interview_date", formattedStart);
    formData.append("interview_end_date", formattedEnd);
    formData.append("interview_url", values.url);
    formData.append("interview_description", values.description);
    formData.append("interviewer", values.Recruiter);
    formData.append("is_rescheduled", isRescheduled);

    let result;
    try {
      const response = await axios({
        headers: { Authorization: `Bearer ${token}` },
        method: "put",
        url: `/interview/reschedule/${firstEvent?.id}/`,
        data: formData,
      });
      result = response;
    } catch (error) {
      setLoading(false);
      console.log("Add Template error--->", error);

      setLoading(false);
      if (error?.response?.data?.status === "401") {
        setErrMssg("Session expired, please login again");
        handleErrAlert();
      }
      handleErrAlert();
      setErrMssg(error.response.data.email[0]);
    }
    if (result && (result.status === 201 || 200)) {
      setLoading(false);
      setShwSccs("block");
      setSccsHead("Success !");
      setSccsMsg("Event updated successfully !");
    }
  };
  const setDate = (type, setter, date) => {
    setter(date);
    formik.setFieldValue(type, date);
  };

  function formatDateTime(date) {
    // Convert the date to the required format
    const formattedDate = date.toISOString().split(".")[0] + "Z";
    return formattedDate;
  }

  /**
   * Filters the end time based on the start time.
   *
   * @param {Date} time - The end time to be filtered.
   * @return {boolean} Returns true if the end time is greater than the start time, otherwise false.
   */

  function filterEndTime(time) {
    if (!DateStart) {
      return true;
    }

    // If the selected end date is greater than the start date, allow all times
    if (formik.values.end?.toDateString() > DateStart?.toDateString()) {
      return true;
    }

    // If the selected end date is the same as the start date, only allow times greater than the start time
    if (formik.values.end?.toDateString() === DateStart?.toDateString()) {
      const startTime = new Date(DateStart);
      startTime.setFullYear(1970, 0, 1);

      const endTime = new Date(time);
      endTime.setFullYear(1970, 0, 1);

      return endTime > startTime;
    }

    // If the selected end date is less than the start date, disallow all times
    return false;
  }

  function filterEndDate(date) {
    if (!DateStart) {
      return true;
    }
    return date.getTime() >= DateStart.getTime();
  }

  const handleCandidateSelect = (obj) => {
    console.log("obj", obj);
    if (obj) {
      formik.setFieldValue("Candidate", obj?.id);
      setCandidateDropdown(obj?.name);
    } else {
      formik.setFieldValue("Candidate", "");
      setCandidateDropdown("");
    }
  };

  const handleMultiDropdown = (val) => {
    // debugger;
    let rctrArr = [...recruiter];
    let rctrId = [...recruiterPayload];

    // Check if the recruiter array already contains the selected recruiter by id
    const recruiterExists = rctrArr.some(
      (recruiter) => recruiter.id === val.id
    );

    if (!recruiterExists) {
      rctrArr.push(val);
    }
    console.log("setting rec 3", rctrArr);
    setRecruiter(rctrArr);

    if (!rctrId.includes(val?.id)) {
      rctrId.push(val?.id);
    }
    setRecruiterPayload(rctrId);
    formik.setFieldValue("Recruiter", rctrId);
  };

  const handleRemove = (idToRemove) => {
    let arr2a = [...recruiter];
    let arr2b = [...recruiterPayload];

    // Find the index of the recruiter with the given id
    const index = arr2a.findIndex((recruiter) => recruiter.id === idToRemove);

    if (index !== -1) {
      arr2a.splice(index, 1);
      arr2b.splice(index, 1);
    }
    console.log("setting rec 4", arr2a);
    setRecruiter(arr2a);
    setRecruiterPayload(arr2b);
    formik.setFieldValue("Recruiter", arr2b);
  };
  const handleModalClose = () => {
    // Reset Formik form
    formik.resetForm();

    // Clear local state values
    setStartDatePickerValue(null);
    setEndDatePickerValue(null);
    setCandidateDropdown("");
    // setCandidateList();
    setRecruiter([]);
    setRecruiterPayload([]);
    let tempArr = adminData;
    tempArr = tempArr.map((item) => {
      // debugger;

      item = { ...item, is_busy: false };

      return item;
    });
    // console.log("tempArr on Close", tempArr);
    setAdminData(tempArr);

    // Call the handleModalClose prop to close the modal
    onClose();
  };

  const handleShwMultiple = async () => {
    // navigate("/Admin/Calendar");

    setMltHead("");
    updateEvent(formik.values);
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      className="modal-cal"
      // size="xl"
      // fullscreen={true}
      // style={{ minWidth: "500px !important" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
              <span className="text-danger">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-danger">{formik.errors.title}</div>
            ) : null}
          </div>
          <Row className="pb-2">
            <Form.Group as={Col} className="py-2" md={12}>
              <Form.Label>
                URL:
                {/* <span className="text-danger">*</span> */}
              </Form.Label>
              <input
                id="url"
                name="url"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.url}
              />
              {formik.touched.url && formik.errors.url ? (
                <div className="text-danger">{formik.errors.url}</div>
              ) : null}
            </Form.Group>
          </Row>
          <Row className="pb-2">
            <Form.Group as={Col} className="py-2" md={12}>
              <Form.Label>
                Description:
                <span className="text-danger">*</span>
              </Form.Label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-danger">{formik.errors.description}</div>
              ) : null}
            </Form.Group>
          </Row>
          {/* <div className="mb-3">
            <label className="form-label">Start</label> */}
          <Row className="pb-2">
            <Form.Group as={Col} className="py-2" md={6}>
              <Form.Label>
                Start (UTC):
                <span className="text-danger">*</span>
              </Form.Label>
              <DatePicker
                // key={formik.values.start}
                // selected={formik.values.start}
                selected={startDatePickerValue}
                // onChange={(date) => setDate("start", setDateStart, date)}
                onChange={(date) => {
                  setStartDatePickerValue(date);
                  formik.setFieldValue("start", date);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                timeCaption="time"
                className="form-control"
              />
              {formik.touched.start && formik.errors.start ? (
                <div className="text-danger">{formik.errors.start}</div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} className="py-2" md={6}>
              <Form.Label>
                End (UTC):
                <span className="text-danger">*</span>
              </Form.Label>
              <DatePicker
                // key={formik.values.end}
                // selected={formik.values.end}
                selected={endDatePickerValue}
                // onChange={(date) => setDate("end", setDateEnd, date)}
                onChange={(date) => {
                  setEndDatePickerValue(date);
                  formik.setFieldValue("end", date);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                timeCaption="time"
                // filterDate={filterEndDate}
                filterTime={filterEndTime}
                className="form-control"
              />
              {formik.touched.end && formik.errors.end ? (
                <div className="text-danger">{formik.errors.end}</div>
              ) : null}
            </Form.Group>
          </Row>

          <Row className="pb-2">
            <Form.Group as={Col} className="py-2" md={6}>
              <Form.Label>
                Recruiter/Hiring Lead:
                <span className="text-danger">*</span>
              </Form.Label>

              {/* <MultiDropdown
                handleRemove={handleRemove}
                fn={handleMultiDropdown}
                value={recruiter}
                arrayList={adminData}
                name="HRS"
                fieldName="HRS"
              /> */}
              <input
                type="hidden"
                name="Campus"
                {...formik.getFieldProps("Recruiter")}
              />
              {formik.touched.Recruiter && formik.errors.Recruiter ? (
                <span className="text-start w-100 my-2 ps-2 text-danger">
                  {formik.errors.Recruiter}
                </span>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} className="py-2" md={6}>
              <Form.Label>
                Candidate:
                <span className="text-danger">*</span>
              </Form.Label>

              <input
                id="Candidate"
                name="Candidate"
                type="text"
                className="form-control"
                value={CandidateDropdown}
                disabled={true}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // value={formik.values.title}
              />
              {formik.touched.Candidate && formik.errors.Candidate ? (
                <span className="text-start w-100 my-2 ps-2 text-danger">
                  {formik.errors.Candidate}
                </span>
              ) : null}
            </Form.Group>
          </Row>

          <button
            title="Remove Event"
            className="btn btn-dark mx-2"
            style={{
              backgroundColor: "#5a5c69",
              borderColor: "#5a5c69",
            }}
            onClick={handleDelete}
          >
            Remove Event
          </button>
          <button
            title="Update Event"
            className="btn btn-dark"
            style={{
              background: "linear-gradient(180deg,#ff4438 0%,#ff4438 100%)",
              border: "1px solid transparent",
            }}
            type="submit"
          >
            Update Event
          </button>
        </form>
      </Modal.Body>
      {loading && (
        <div className="loader">
          <HashLoader color="#fff" loading={loading} size={140} />
          <br />
          <br />
          <h4 style={{ color: "#fff" }}>Loading...</h4>
        </div>
      )}
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
      <div className="sweet-overlay" style={{ display: shwSccs }}>
        <div className="sweet-alert">
          <div className="sa-success" style={{ border: "4px solid #A5DC86" }}>
            <div className="sa-success-tip"></div>
            <div className="sa-success-long"></div>
            <div className="sa-success-placeholder"></div>
            <div className="sa-success-fix" style={{ height: "55px" }}></div>
          </div>
          <h2>{sccsHead}</h2>
          <p style={{ display: "block" }}>{sccsMsg}</p>
          <Button className="sweet-btn" onClick={() => handleShwSccs()}>
            Ok
          </Button>
        </div>
      </div>
      <div className="sweet-overlay" style={{ display: shwDlt }}>
        <div className="sweet-alert">
          <div className="err-icon">
            <span className="err-body pulseWarningIns"></span>
            <span className="err-dot pulseWarningIns"></span>
          </div>
          <h2>Are you sure?</h2>
          <p style={{ display: "block" }}>{errMssg}</p>
          <button
            className="btn btn-dark mx-2"
            style={{
              marginTop: "10px",
              backgroundColor: "#5a5c69",
              borderColor: "#5a5c69",
            }}
            onClick={() => cancelDlt()}
          >
            Cancel
          </button>
          <button
            className="btn btn-dark"
            style={{
              marginTop: "10px",
              background: "linear-gradient(180deg,#ff4438 0%,#ff4438 100%)",
              border: "1px solid transparent",
            }}
            onClick={() => handleCfmDlt()}
          >
            Yes, delete it !
          </button>
        </div>
      </div>
      <div
        className="sweet-overlay"
        style={{ display: mltHead ? "block" : "none" }}
      >
        <div className="sweet-question">
          <h5>{mltHead}</h5>
          <p style={{ display: "block" }}>{sccsMsg}</p>

          <button
            className="btn btn-dark mx-2"
            style={{
              backgroundColor: "#5a5c69",
              borderColor: "#5a5c69",
            }}
            onClick={() => setMltHead("")}
          >
            Cancel
          </button>
          <button
            className="btn btn-dark"
            style={{
              background: "linear-gradient(180deg,#ff4438 0%,#ff4438 100%)",
              border: "1px solid transparent",
            }}
            onClick={() => handleShwMultiple()}
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditEventModal;
