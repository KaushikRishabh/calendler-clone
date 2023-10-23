import moment from "moment";

const today = moment().startOf("day").valueOf();
const oneHour = 3600000; // milliseconds
const dummyData = [
  {
    id: "event-1",
    title: "Morning Meeting",
    interview_date: "2023-09-30T09:00:00Z",
    interview_end_date: "2023-09-30T10:00:00Z",
  },
  {
    id: "event-2",
    title: "Lunch with John",
    interview_date: "2023-09-30T12:00:00Z",
    interview_end_date: "2023-09-30T13:00:00Z",
  },
  {
    id: "event-3",
    title: "Project Review",
    interview_date: "2023-09-30T15:00:00Z",
    interview_end_date: "2023-09-30T16:00:00Z",
  },
];
const dummyData2 = [
  {
    candidate_info: {
      id: 1472,
      name: "Rishabh Kaushik",
      email: "hedge@yopmail.com",
    },
    recruiters: {
      id: 772,
      name: "RK HR",
      email: "abcd@yopmail.com",
    },
    job_info: {
      job_posting_id: 518,
      posting_title: "HR",
    },
    interview_title:
      "Test title 1Test title 1Test title 1Test title 1Test title 1",
    interview_date: "2023-10-05T19:01:50Z",
    interview_end_date: "2023-10-05T23:01:50Z",
    interview_url: "www.com.com",
    interview_description: "asgasgaga",
  },
  {
    candidate_info: {
      id: 1473,
      name: "S A",
      email: "abc@yopmail.com",
    },
    recruiters: {
      id: 772,
      name: "RK HR",
      email: "abcd@yopmail.com",
    },
    job_info: {
      job_posting_id: 520,
      posting_title: "HR",
    },
    interview_title: "Test title 2",
    interview_date: "2023-10-05T18:01:50Z",
    interview_end_date: "2023-10-05T20:01:50Z",
    interview_url: "www.com.com",
    interview_description: "asgasgaga",
  },
  {
    candidate_info: {
      id: 1424,
      name: "Rishabh Kaushik",
      email: "reachmeatrish@gmail.com",
    },
    recruiters: {
      id: 772,
      name: "RK HR",
      email: "abcd@yopmail.com",
    },
    job_info: {
      job_posting_id: 527,
      posting_title: "Java Developer",
    },
    interview_title: "Test title 3",
    interview_date: "2023-10-02T19:18:23Z",
    interview_end_date: "2023-10-02T20:18:23Z",
    interview_url: "www.com.com",
    interview_description: "asgasgaga",
  },
];

// const dummyData = {
//   [today + 9 * oneHour]: [
//     {
//       id: "event-1",
//       title: "Morning Meeting",
//       start: today + 9 * oneHour,
//       end: today + 10 * oneHour,
//     },
//   ],
//   [today + 13 * oneHour]: [
//     {
//       id: "event-2",
//       title: "Lunch with John",
//       start: today + 13 * oneHour,
//       end: today + 14 * oneHour,
//     },
//   ],
//   [today + 15 * oneHour]: [
//     {
//       id: "event-3",
//       title: "Project Review",
//       start: today + 15 * oneHour,
//       end: today + 16 * oneHour,
//     },
//   ],
// };

export default dummyData2;
