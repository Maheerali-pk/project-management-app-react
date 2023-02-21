import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getters, useGlobalContext } from "../GlobalContext/GlobalContext";
import {
   getMonthListBetweenDates,
   getLinePath,
   getTrianglePoints,
   getMousePos,
   getCompleteDateList,
   compareDates,
} from "../utils/helpers";
import TaskDetails from "./TaskDetails";
import UserList from "./UserList";
import "./Calendar.scss";
import classNames from "classnames";
interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
   const [size, setSize] = useState(10);
   const [noOfRows, setNoOfRows] = useState(0);
   const [state, dispatch] = useGlobalContext();
   const [templateRows, setTemplateRows] = useState("");

   useEffect(() => {
      dispatch({ updateLinks: undefined });
      const grid = document.querySelector("#grid");
      const height = grid?.getBoundingClientRect().height;
      if (height) {
         const noOfRows = Math.floor(height / 55);
         const remainingPart = height % 55;
         setNoOfRows(noOfRows + 1);

         setTemplateRows(`repeat(${noOfRows}, 55px) ${remainingPart}px`);
      }

      const activeProject = getters.getActiveProject(state);
      const allDates = getCompleteDateList(activeProject.startDate, activeProject.endDate);
      const colNo = allDates.findIndex((x) => compareDates(x, new Date()));
      const width = colNo * 38;
      const gridWrapper = document.querySelector("#grid-wrapper");
      gridWrapper?.scrollTo({ left: width });
   }, []);
   const getCalendarHeight = () => {
      return window.innerHeight - 186 + 90;
   };
   const getTemplateRows = () => {
      const grid = document.querySelector("#grid");
      const height = grid?.getBoundingClientRect().height;
      if (height) {
         const noOfRows = Math.floor(height / 55);
         const remainingPart = height % 55;
         return `repeat(${noOfRows}, 55px) ${remainingPart}px`;
      }
      console.log("Height not found");
      return "";
   };
   const getNoOfRows = () => {
      const grid = document.querySelector("#grid");
      const height = grid?.getBoundingClientRect().height;
      if (height) {
         const noOfRows = Math.floor(height / 55);
         const remainingPart = height % 55;
         return noOfRows + 1;
      }
   };

   const getTotalRows = () => {
      return getters.getActiveProject(state).users.reduce((ac, a) => ac + a.noOfRows, 0);
   };
   const getMPos = () => {
      return state.mouse;
   };
   const getTasksToRemoveOverlap = () => {
      const activeProject = getters.getActiveProject(state);
      const activeTasks = activeProject.tasks;
      const tasksByUser = activeProject.users.map((u) => ({
         ...u,
         tasks: activeTasks.filter((t) => t.userId === u.id),
      }));
   };
   const getWeekends = () => {
      const { endDate, startDate } = getters.getActiveProject(state);

      const dateList = getCompleteDateList(startDate, endDate);
      return dateList
         .map((x, i) => ({ date: x, index: i }))
         .filter(({ date }) => date.getDay() === 0 || date.getDay() === 6);
   };
   const getAllDates = () => {
      const { endDate, startDate } = getters.getActiveProject(state);
      const dateList = getCompleteDateList(startDate, endDate);
      return dateList;
   };
   const dateList = () => {
      const { endDate, startDate } = state.projects[0];
      return getMonthListBetweenDates(startDate, endDate);
   };
   // getAllDates(){
   // }
   // const templateRows = () =>{
   //    const users = state.projects[0].users as IUser[];
   //    return `${users.flatMap((x) => Array(x.noOfRows).fill("55px")).join(" ")}`;
   // }
   const getTasks = () => {
      const activeProject = getters.getActiveProject(state) as IProject;
      return activeProject.tasks.map((x) => ({
         ...x,
         img: activeProject.users.find((u) => u.id === x.userId)?.img || "",
      }));
   };
   const getLinks = () => {
      const activeProject = getters.getActiveProject(state) as IProject;

      return activeProject.links;
   };
   const getBorders = () => {
      const activeTasks = getters.getActiveProject(state)?.tasks;
      if (activeTasks) {
         return activeTasks;
      }
   };
   const getUsers = () => {
      const users = getters.getActiveProject(state).users as IUser[];
      return users.map((x, i) => {
         const startRow = users.slice(0, i).reduce((ac, a) => ac + a.noOfRows, 0);
         return { ...x, startRow, endRow: startRow + x.noOfRows };
      });
   };
   const getHighlightedDates = () => {
      const selectedTask = getters.getActiveProject(state).tasks.find((x) => x.selected) as ITask;
      if (selectedTask) {
         return Array(selectedTask.endCol - selectedTask.startCol)
            .fill(0)
            .map((x, i) => selectedTask.startCol + i);
      }
      return [] as number[];
   };
   const getHighlightedTasks = () => {
      const activeProject = getters.getActiveProject(state) as IProject;
      const selectedTask = getters.getActiveProject(state).tasks.find((x) => x.selected) as ITask;
      if (selectedTask) {
         const links = activeProject.links.filter((x) => x.task1 === selectedTask.id || x.task2 === selectedTask.id);
         const tasks = Array.from(new Set(links.flatMap((x) => [x.task1, x.task2]))).filter(
            (x) => x !== selectedTask.id
         );
         console.log(tasks, "Selected tasks");
         return tasks;
      }
      return [];
   };

   const getMonthList = useCallback(() => {
      const { endDate, startDate } = state.projects[0];
      const monthList = getMonthListBetweenDates(startDate, endDate);
      const dateList = getCompleteDateList(startDate, endDate);
      // const allMonths = [...new Set(dateList.map(x => x.getMonth()))];
      // const datesByMonths = allMonths.map(x => dateList.filter())
      // const datesByMonth =
      const monthListWithStartCol = monthList
         .map((x, i) => ({
            ...x,
            noOfDays: dateList.filter((d) => d.getMonth() === x.monthNo).length,
         }))
         .map((x, i, monthList) => ({
            ...x,
            startCol: monthList.slice(0, i).reduce((ac, a) => ac + a.noOfDays, 0),
         }));
      return monthListWithStartCol;
   }, []);

   const getTotalDays = () => {
      return getAllDates().length + 1;
   };
   const getDateList = () => {
      return dateList().flatMap((x) => [...Array(x.noOfDays)].map((x, i) => i + 1));
   };
   const selectTask = (taskId: string) => {
      dispatch({ selectTaskById: taskId });
   };
   const onMouseDownOnMover = (task: ITask, dir: MoverDirection) => {
      dispatch({ mouseDownOnMover: dir });
   };
   const onMouseDownOnBody = (e: React.MouseEvent, task: ITask) => {
      const [x, _] = getMousePos(e);
      const grabColOffset = Math.ceil(x / 38) - task.startCol;
      dispatch({ mouseDownOnTaskBody: { task, grabColOffset } });
   };
   const onMouseMove = (e: React.MouseEvent) => {
      const wrapper = e.target as HTMLElement;
      const { left, top } = wrapper.getBoundingClientRect();
      // console.log(left, top);
      dispatch({ onMouseMove: getMousePos(e) });
   };
   const onMouseUp = (e: React.MouseEvent) => {
      dispatch({ onMouseUp: undefined });
   };
   const mouseDownOnArrow = (e: React.MouseEvent, linkId: string) => {
      e.preventDefault();
      e.stopPropagation();
      // To be added
      // e.stopImmediatePropagation();
      dispatch({ mouseDownOnArrow: linkId });
   };
   const mouseDownOnCircle = (e: React.MouseEvent, linkId: string) => {
      e.preventDefault();

      e.stopPropagation();
      // To be added
      // e.stopImmediatePropagation();
      console.log("mouse down on circle called");
      dispatch({ mouseDownOnCircle: linkId });
   };
   // const onCloseBtnClick = (e: React.MouseEvent, linkId: string) => {
   //    dispatch({ deleteLink: linkId });
   // };
   const getSelectedTaskId = () => {
      return getters.getActiveProject(state).tasks.find((x) => x.selected)?.id || "-1";
   };
   // const onClickOnGrid = () => {};
   // const onGridScroll = (e: React.UIEvent) => {};

   const links = getLinks();

   const months = useMemo(() => getMonthList(), [getMonthList]);
   const allDates = useMemo(() => getAllDates(), [getAllDates]);
   const weekends = useMemo(() => getWeekends(), [getWeekends]);
   const users = useMemo(() => getUsers(), [getUsers]);
   const tasks = useMemo(() => getTasks(), [getTasks]);
   const highlightedDates = getHighlightedDates();
   const highlightedTasks = getHighlightedTasks();

   console.log("re rendered", links);
   return (
      <div onMouseUp={onMouseUp} className="wrapper-wrapper">
         <UserList></UserList>
         <div
            onScroll={(e) => dispatch({ setGridScroll: (e.target as HTMLElement).scrollLeft })}
            onMouseMove={onMouseMove}
            id="grid-wrapper"
            className="wrapper"
         >
            <svg
               className="main-svg"
               version="1.1"
               style={{ width: getTotalDays() * 38 }}
               width="300"
               height="200"
               xmlns="http://www.w3.org/2000/svg"
               onClick={() => dispatch({ deselectAllTasks: undefined })}
            >
               {links.map((link) => (
                  <path
                     fill="none"
                     className={classNames("", {
                        highlighted: link.task1 === getSelectedTaskId() || link.task2 === getSelectedTaskId(),
                     })}
                     d={link.path}
                     strokeWidth="2"
                     stroke="black"
                  ></path>
               ))}

               {links.map((link) => (
                  <g>
                     <path
                        className="invisible-path"
                        fill="none"
                        d={link.path}
                        strokeWidth="15"
                        style={{ stroke: "transparent" }}
                     ></path>
                     <g className="close" onClick={(e) => dispatch({ deleteLink: link.id })}>
                        <circle cx={link.midPoint[0]} cy={link.midPoint[1]} r="7" fill="#0F393B"></circle>
                        <line
                           className="cross-line"
                           x1={link.midPoint[0] - 3}
                           y1={link.midPoint[1] - 3}
                           x2={link.midPoint[0] + 3}
                           y2={link.midPoint[1] + 3}
                        />
                        <line
                           className="cross-line"
                           x1={link.midPoint[0] - 3}
                           y1={link.midPoint[1] + 3}
                           x2={link.midPoint[0] + 3}
                           y2={link.midPoint[1] - 3}
                        />
                     </g>
                     <polygon points={link.trianglePoints} />
                  </g>
               ))}
               {links.map((link) => (
                  <circle
                     // v-for="link in getLinks"
                     onMouseDown={(e) => mouseDownOnCircle(e, link.id)}
                     cx={link.point1[0] + 4}
                     cy={link.point1[1]}
                     r="5"
                     className="movement-circle"
                     onClick={(e) => e.stopPropagation()}
                  ></circle>
               ))}
               {links.map((link) => (
                  <polygon
                     points={link.trianglePoints}
                     className={classNames({
                        highlighted: link.task1 === getSelectedTaskId() || link.task2 === getSelectedTaskId(),
                     })}
                     onClick={(e) => e.stopPropagation()}
                     onMouseDown={(e) => mouseDownOnArrow(e, link.id)}
                  />
               ))}
            </svg>
            <div
               id="grid-grid"
               style={{
                  width: getTotalDays() * 38 + "px",
               }}
            >
               <div className="month-labels">
                  {months.map((month) => (
                     <div style={{ gridColumn: `${month.startCol + 1}/${month.startCol + 1 + month.noOfDays}` }}>
                        {month.month}
                     </div>
                  ))}
               </div>
               <div className="calendar-labels-grid">
                  {allDates.map((date, i) => (
                     <div
                        className={classNames("", {
                           weekend: date.getDay() === 6 || date.getDay() === 0,
                           sunday: date.getDay() === 0,
                           saturday: date.getDay() === 6,
                           highlighted: highlightedDates.includes(i + 1),
                           highlightedStart: highlightedDates[0] === i + 1,
                           highlightedEnd: highlightedDates.slice(-1)[0] === i + 1,
                        })}
                     >
                        {date.getDate()}
                     </div>
                  ))}
               </div>
               <div
                  draggable="false"
                  id="grid"
                  style={{
                     width: getTotalDays() * 38 + "px",
                     // gridTemplateColumns: `repeat(${getTotalDays()}, 38px)`,
                     gridTemplateRows: getTemplateRows() || templateRows,
                  }}
               >
                  {weekends.map((date) => (
                     <div
                        className="weekend-overlay"
                        style={{
                           gridColumn: `${date.index + 1} / ${date.index + 1}`,
                           gridRow: `1/${(getNoOfRows() || noOfRows) + 1}`,
                        }}
                     ></div>
                  ))}
                  {users.map((user) => (
                     <div
                        className="user-divider"
                        style={{
                           gridRow: user.endRow + 1,
                           gridColumn: `1/${getTotalDays()}`,
                           display: user.id === "-1" ? "none" : "",
                        }}
                     ></div>
                  ))}

                  {tasks.map((task) => (
                     <div
                        draggable="false"
                        // v-for="task in getTasks"
                        onClick={() => selectTask(task.id)}
                        className={classNames({
                           highlighted: highlightedTasks.includes(task.id),
                           "task-wrapper": true,
                           small: task.endCol - task.startCol === 2 || task.endCol - task.startCol === 3,
                           verySmall: task.endCol - task.startCol === 1,
                           selected: task.selected,
                           "show-tooltip": task.endCol - task.startCol <= 3,
                           completed: task.completed,
                        })}
                        aria-selected="false"
                        style={{ gridColumn: `${task.startCol}/${task.endCol}`, gridRow: `${task.row}` }}
                     >
                        <div className="close-icon" onClick={() => dispatch({ removeTask: task.id })}>
                           <i className="fas fa-close"></i>
                        </div>
                        <div className="task-tooltip task-wrapper">
                           <div onMouseDown={(e) => onMouseDownOnBody(e, task)} draggable="false" className="task-body">
                              {task.completed && (
                                 <svg
                                    className="complete-icon"
                                    v-if="task.completed"
                                    style={{ marginRight: 5 }}
                                    width="25"
                                    height="25"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M7 12L10.5 15.5L17 9"
                                       stroke="#0F393B"
                                       strokeWidth="1.5"
                                       strokeLinejoin="round"
                                    />
                                    <circle cx="12.5" cy="12.5" r="11.75" stroke="#0F393B" strokeWidth={1.5} />
                                 </svg>
                              )}

                              {task.userId !== "-1" && <img src={task.img} v-if="task.userId !== '-1'" />}
                              <div
                                 onBlur={(e) =>
                                    dispatch({ updateTaskText: { id: task.id, text: e.target.textContent || "" } })
                                 }
                                 contentEditable="true"
                                 suppressContentEditableWarning={true}
                              >
                                 {task.text}
                              </div>
                              {task.subtasks.length && (
                                 <div v-if="task.subtasks.length" className="subtasks-count">
                                    {task.subtasks.length}
                                    <svg
                                       width="14"
                                       height="13"
                                       viewBox="0 0 14 13"
                                       fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <path
                                          d="M3.23212 5.46604L1.7252 7.13948L1.12036 6.53491C0.864011 6.27856 0.448796 6.27856 0.192312 6.53491C-0.0641724 6.79126 -0.0640356 7.20647 0.192312 7.46296L1.28606 8.55671C1.40911 8.68167 1.57673 8.75003 1.72548 8.75003C1.73146 8.75003 1.73659 8.75003 1.74257 8.7496C1.92288 8.7449 2.09285 8.66672 2.21343 8.53298L4.18218 6.34548C4.42486 6.0759 4.40263 5.66107 4.13348 5.41826C3.88837 5.1762 3.47548 5.19807 3.23212 5.46604ZM3.23212 1.09214L1.7252 2.76448L1.12036 2.15991C0.864011 1.90356 0.448796 1.90356 0.192312 2.15991C-0.0641724 2.41626 -0.0640356 2.83147 0.192312 3.08796L1.28606 4.18171C1.40911 4.30667 1.57673 4.37503 1.72548 4.37503C1.73146 4.37503 1.73659 4.37503 1.74257 4.3746C1.92288 4.3699 2.09285 4.29172 2.21343 4.15798L4.18218 1.97048C4.42486 1.7009 4.40263 1.28607 4.13348 1.04326C3.88837 0.801471 3.47548 0.8228 3.23212 1.09214ZM1.31259 10.0379C0.587703 10.0379 8.54481e-05 10.6255 8.54481e-05 11.3504C8.54481e-05 12.0753 0.587703 12.6629 1.31259 12.6629C2.03747 12.6629 2.62509 12.0753 2.62509 11.3504C2.62509 10.6504 2.03747 10.0379 1.31259 10.0379ZM7.00008 3.50003H13.1251C13.6082 3.50003 14.0001 3.10819 14.0001 2.62503C14.0001 2.14186 13.6082 1.75003 13.1251 1.75003H7.00008C6.5161 1.75003 6.12509 2.14186 6.12509 2.62503C6.12509 3.10819 6.5161 3.50003 7.00008 3.50003ZM13.1251 6.12503H7.00008C6.5161 6.12503 6.12509 6.51604 6.12509 7.00003C6.12509 7.48401 6.51692 7.87503 7.00008 7.87503H13.1251C13.6082 7.87503 14.0001 7.48319 14.0001 7.00003C14.0001 6.51686 13.6091 6.12503 13.1251 6.12503ZM13.1251 10.5H5.25009C4.76692 10.5 4.37509 10.8919 4.37509 11.375C4.37509 11.8582 4.76692 12.25 5.25009 12.25H13.1251C13.6082 12.25 14.0001 11.8582 14.0001 11.375C14.0001 10.8919 13.6091 10.5 13.1251 10.5Z"
                                          fill="#0F393B"
                                       />
                                    </svg>
                                 </div>
                              )}
                           </div>
                        </div>

                        {task.selected && (
                           <div
                              v-if="task.selected"
                              onMouseDown={() => onMouseDownOnMover(task, "left")}
                              className="task-mover task-mover-left"
                           >
                              <svg
                                 width={6}
                                 height={17}
                                 viewBox="0 0 6 17"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <line
                                    y1={-0.75}
                                    x2={17}
                                    y2={-0.75}
                                    transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 0)"
                                    stroke="#F5F3EE"
                                    strokeWidth={1.5}
                                 />
                                 <line
                                    y1={-0.75}
                                    x2={17}
                                    y2={-0.75}
                                    transform="matrix(4.37114e-08 1 1 -4.37114e-08 6 0)"
                                    stroke="#F5F3EE"
                                    strokeWidth={1.5}
                                 />
                              </svg>
                           </div>
                        )}
                        <div onMouseDown={(e) => onMouseDownOnBody(e, task)} draggable="false" className="task-body">
                           {task.completed && (
                              <svg
                                 className="complete-icon"
                                 v-if="task.completed"
                                 style={{ marginRight: 5 }}
                                 width={25}
                                 height={25}
                                 viewBox="0 0 25 25"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    d="M7 12L10.5 15.5L17 9"
                                    stroke="#0F393B"
                                    strokeWidth={1.5}
                                    strokeLinejoin="round"
                                 />
                                 <circle cx="12.5" cy="12.5" r="11.75" stroke="#0F393B" strokeWidth={1.5} />
                              </svg>
                           )}

                           {task.userId !== "-1" && <img src={task.img} v-if="task.userId !== '-1'" />}
                           <div
                              onBlur={(e) =>
                                 dispatch({ updateTaskText: { id: task.id, text: e.target.textContent as string } })
                              }
                              suppressContentEditableWarning={true}
                              contentEditable={true}
                           >
                              text
                           </div>

                           {task.subtasks.length && (
                              <div v-if="task.subtasks.length" className="subtasks-count">
                                 {task.subtasks.length}
                                 <svg
                                    width={14}
                                    height={13}
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M3.23212 5.46604L1.7252 7.13948L1.12036 6.53491C0.864011 6.27856 0.448796 6.27856 0.192312 6.53491C-0.0641724 6.79126 -0.0640356 7.20647 0.192312 7.46296L1.28606 8.55671C1.40911 8.68167 1.57673 8.75003 1.72548 8.75003C1.73146 8.75003 1.73659 8.75003 1.74257 8.7496C1.92288 8.7449 2.09285 8.66672 2.21343 8.53298L4.18218 6.34548C4.42486 6.0759 4.40263 5.66107 4.13348 5.41826C3.88837 5.1762 3.47548 5.19807 3.23212 5.46604ZM3.23212 1.09214L1.7252 2.76448L1.12036 2.15991C0.864011 1.90356 0.448796 1.90356 0.192312 2.15991C-0.0641724 2.41626 -0.0640356 2.83147 0.192312 3.08796L1.28606 4.18171C1.40911 4.30667 1.57673 4.37503 1.72548 4.37503C1.73146 4.37503 1.73659 4.37503 1.74257 4.3746C1.92288 4.3699 2.09285 4.29172 2.21343 4.15798L4.18218 1.97048C4.42486 1.7009 4.40263 1.28607 4.13348 1.04326C3.88837 0.801471 3.47548 0.8228 3.23212 1.09214ZM1.31259 10.0379C0.587703 10.0379 8.54481e-05 10.6255 8.54481e-05 11.3504C8.54481e-05 12.0753 0.587703 12.6629 1.31259 12.6629C2.03747 12.6629 2.62509 12.0753 2.62509 11.3504C2.62509 10.6504 2.03747 10.0379 1.31259 10.0379ZM7.00008 3.50003H13.1251C13.6082 3.50003 14.0001 3.10819 14.0001 2.62503C14.0001 2.14186 13.6082 1.75003 13.1251 1.75003H7.00008C6.5161 1.75003 6.12509 2.14186 6.12509 2.62503C6.12509 3.10819 6.5161 3.50003 7.00008 3.50003ZM13.1251 6.12503H7.00008C6.5161 6.12503 6.12509 6.51604 6.12509 7.00003C6.12509 7.48401 6.51692 7.87503 7.00008 7.87503H13.1251C13.6082 7.87503 14.0001 7.48319 14.0001 7.00003C14.0001 6.51686 13.6091 6.12503 13.1251 6.12503ZM13.1251 10.5H5.25009C4.76692 10.5 4.37509 10.8919 4.37509 11.375C4.37509 11.8582 4.76692 12.25 5.25009 12.25H13.1251C13.6082 12.25 14.0001 11.8582 14.0001 11.375C14.0001 10.8919 13.6091 10.5 13.1251 10.5Z"
                                       fill="#0F393B"
                                    />
                                 </svg>
                              </div>
                           )}
                        </div>
                        {task.selected && (
                           <div
                              v-if="task.selected"
                              onMouseDown={() => onMouseDownOnMover(task, "right")}
                              className="task-mover task-mover-right"
                           >
                              <svg
                                 width={6}
                                 height={17}
                                 viewBox="0 0 6 17"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <line
                                    y1={-0.75}
                                    x2={17}
                                    y2={-0.75}
                                    transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 0)"
                                    stroke="#F5F3EE"
                                    strokeWidth={1.5}
                                 />
                                 <line
                                    y1={-0.75}
                                    x2={17}
                                    y2={-0.75}
                                    transform="matrix(4.37114e-08 1 1 -4.37114e-08 6 0)"
                                    stroke="#F5F3EE"
                                    strokeWidth={1.5}
                                 />
                              </svg>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Calendar;

{
   /* <script lang="ts">

</script>
 */
}
