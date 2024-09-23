import React from "react";
import Timeline from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import styled from "styled-components";

const groups = [
  { id: 1, title: "group 1" },
  { id: 2, title: "group 2" },
  { id: 3, title: "group 3" },
  { id: 4, title: "group 4" },
  { id: 5, title: "group 5" },
];

const items = [
  {
    id: 1,
    group: 1,
    title: "브랜딩",
    start_time: moment(),
    end_time: moment().add(1, "month"),
  },
  {
    id: 2,
    group: 2,
    title: "디자인",
    start_time: moment().add(-0.5, "month"),
    end_time: moment().add(0.5, "month"),
  },
  {
    id: 3,
    group: 3,
    title: "백엔드",
    start_time: moment().add(2, "month"),
    end_time: moment().add(3, "month"),
  },
  {
    id: 4,
    group: 4,
    title: "백엔드 DB",
    start_time: moment().add(2, "month"),
    end_time: moment().add(3, "month"),
  },
  {
    id: 5,
    group: 5,
    title: "백엔드 DB",
    start_time: moment().add(2, "month"),
    end_time: moment().add(3, "month"),
  },
];

function TimeLine({}) {
  return (
    <div>
      <CustomTimeLine>
        <Timeline groups={groups} items={items} defaultTimeStart={moment().add(-12, "month")} defaultTimeEnd={moment().add(12, "month")} />
      </CustomTimeLine>
      ,
    </div>
  );
}

export default TimeLine;
const CustomTimeLine = styled.div`
  .rct-sidebar-row {
    color: #111;
  }
`;
