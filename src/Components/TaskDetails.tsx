import classNames from "classnames";
import { useRef, useState } from "react";
import { getters, useGlobalContext } from "../GlobalContext/GlobalContext";
import {
   getMonthListBetweenDates,
   getLinePath,
   getTrianglePoints,
   getMousePos,
   getCompleteDateList,
   dateToString,
} from "../utils/helpers";
import "./TaskDetails.scss";
import "../global.scss";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, DesktopDatePicker, LocalizationProvider, MuiPickersAdapterContext } from "@mui/x-date-pickers";
import {
   Autocomplete,
   Button,
   Icon,
   IconButton,
   Input,
   Menu,
   MenuItem,
   Popover,
   TextField,
   withStyles,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { PropaneSharp } from "@mui/icons-material";
interface TaskDetailsProps {}
const styles = () => ({
   paper: {
      width: "100%",
   },
});
const TaskDetails: React.FC<TaskDetailsProps> = (props) => {
   const [state, dispatch] = useGlobalContext();
   const [data, setData] = useState({
      size: 10,
      loading: false,
      options: getters.getActiveProject(state).users.filter((x) => x.id !== "-1"),
      list: getters.getActiveProject(state).users.filter((x) => x.id !== "-1"),
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
   });
   const [showTo, setShowTo] = useState(false);
   const [showFrom, setShowFrom] = useState(false);
   const [showSubtaskDP, setShowSubtaskDP] = useState(false);
   const calendarIconRef = useRef<HTMLDivElement>(null);
   const [showDeps, setShowDeps] = useState(false);
   const addDepsRef = useRef<HTMLDivElement>(null);
   const subtasksWrapperRef = useRef<HTMLDivElement>(null);
   const popupAnchorRef = useRef<HTMLDivElement | null>(null);

   const getImageForSubtask = (subtask: ISubTask) => {
      const user = getters.getActiveProject(state).users.find((x) => x.id === subtask.userId);
      if (user) {
         return user.img;
      }
   };
   const handleRemove = (file: any) => {
      console.log(file);
   };
   const handlePictureCardPreview = (file: any) => {
      data.dialogImageUrl = file.url;
      data.dialogVisible = true;
   };
   const handleDownload = (file: any) => {
      console.log(file);
   };
   const onStartDateChange = (date: Date) => {
      dispatch({ updateDateOfSelectedTask: { type: "start", date } });
   };
   const onEndDateChange = (date: Date) => {
      dispatch({ updateDateOfSelectedTask: { type: "end", date } });
   };
   const addLink = (id: string) => {
      console.log("Add link called");
      console.log(id);
      const activeProject = getters.getActiveProject(state);
      const taskList = getTaskList();
      const task = taskList.find((x) => x.id === id);
      if (task?.active) {
         dispatch({ removeLinkFromSelectedTask: id });
      } else {
         dispatch({ addLinkToSelectedTask: id });
      }
   };
   const changeDescription = (e: InputEvent) => {
      dispatch({ addDescriptionToSelectionTask: (e.target as HTMLInputElement).value });
   };
   const toggleSelection = (subtask: ISubTask) => {
      dispatch({ updateSubTask: { id: subtask.id, selected: !subtask.selected } });
   };
   const toggleCompleted = (e: Event, subtask: ISubTask) => {
      e.stopPropagation();
      dispatch({ updateSubTask: { id: subtask.id, isCompleted: !subtask.isCompleted } });
   };
   const onSubtaskDateChange = (subtask: ISubTask, date: Date) => {
      dispatch({ updateSubTask: { id: subtask.id, date } });
   };
   const remoteMethod = (query: any) => {
      if (query !== "") {
         setData({ ...data, loading: true });
         setTimeout(() => {
            setData({
               ...data,
               loading: false,
               options: [
                  ...data.list.filter((item) => {
                     return (
                        item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                        item.email.toLocaleLowerCase().includes(item.email)
                     );
                  }),
               ],
            });
         }, 200);
      } else {
         setData({ ...data, options: [] });
      }
   };
   const onSubtaskValueChange = (e: Event, subTask: ISubTask) => {
      const newValue = (e.target as HTMLInputElement).value;
      dispatch({ updateSubTask: { id: subTask.id, text: newValue } });
   };
   const addSubtask = () => {
      dispatch({ addSubtaskToSelectedTask: undefined });
   };
   const assignSubTaskToMe = (subTask: ISubTask) => {
      dispatch({ updateSubTask: { id: subTask.id, userId: state.currentUserId } });
   };
   const hideTaskdetails = () => {
      dispatch({ hideTaskDetails: undefined });
   };
   const getActiveProject = () => {
      return getters.getActiveProject(state);
   };
   const getUsers = () => {
      const activeProject = getters.getActiveProject(state) as IProject;
      return activeProject.users;
   };
   const getTaskList = () => {
      const activeProject = getters.getActiveProject(state) as IProject;

      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      if (!selectedTask) return [];
      const links = activeProject.links
         .filter((x) => x.task1 === selectedTask.id || x.task2 === selectedTask.id)
         .flatMap((x) => [x.task1, x.task2]);
      return activeProject.tasks
         .filter((x) => x.id !== selectedTask.id)
         .map((x) => ({ ...x, active: links.includes(x.id) }));
   };
   const getActiveTask = () => {
      const activeProject = getters.getActiveProject(state) as IProject;
      return (getters.getActiveProject(state).tasks.find((x) => x.selected) as ITask) || { subtasks: [] };
   };
   const getTaskDetails = (): Partial<
      IProject & { user: IUser; projectName: string; startDate: Date; endDate: Date }
   > => {
      const activeProject = getters.getActiveProject(state) as IProject;
      const activeTask = activeProject.tasks.find((x) => x.selected) as ITask;
      if (!activeTask) return {};
      else {
         const user = activeProject.users.find((x) => x.id === activeTask.userId) as IUser;
         const allDates = getCompleteDateList(activeProject.startDate, activeProject.endDate);
         const startDate = allDates[activeTask.startCol - 1];
         const endDate = allDates[activeTask.endCol - 2];
         return { ...activeProject, user, projectName: activeProject.name, startDate, endDate };
      }
   };
   const getTaskDetailsStatus = () => {
      return state.showTaskDetails;
   };
   const activeTask = getActiveTask();
   const taskDetails = getTaskDetails();
   const taskList = getTaskList();
   console.log(activeTask.subtasks);
   return (
      <div className={classNames("task-details-wrapper", { opened: state.showTaskDetails })}>
         {state.showTaskDetails && (
            <div className="header" v-if="state.showTaskDetails">
               <div
                  className={classNames("btn", { completed: activeTask.completed })}
                  onClick={() => dispatch({ toggleCompleteTask: undefined })}
                  // @click="store.commit('toggleCompleteTask', undefined)"
               >
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1 5.61538L6.25 11L16 1" stroke="#0F393B" stroke-width="1.5" stroke-linejoin="round" />
                  </svg>

                  {activeTask.completed ? (
                     <span v-if="getActiveTask.completed">Mark it as incomplete</span>
                  ) : (
                     <span v-else>Mark it as complete</span>
                  )}
               </div>
               <div className="icons">
                  <div className="files">
                     {activeTask.fileList.map((file) => (
                        <div v-for="file in getActiveTask.fileList" className="btn file">
                           <a href="file.url" download>
                              {file.name}
                           </a>
                           <i
                              className="fas fa-close"
                              onClick={() => dispatch({ removeFile: file.name })}
                              // @click.stop="store.commit('removeFile', file.name)"
                           ></i>
                        </div>
                     ))}
                  </div>
                  <div>
                     <label htmlFor="file-input">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M6.19141 20C2.83867 20 0.09375 17.2578 0.09375 13.832C0.09375 12.1941 0.731641 10.6539 1.88984 9.49609L10.1242 1.25781C10.9883 0.430859 12.168 0 13.3477 0C16.2812 0 17.9062 2.37773 17.9062 4.51562C17.9062 5.73359 17.4324 6.87812 16.5711 7.73906L9.00859 15.3055C8.44492 15.8695 7.67148 16.1516 6.89805 16.1516C4.52617 16.1516 3.91484 14.0352 3.91484 13.1949C3.91484 12.4305 4.20578 11.6664 4.7875 11.0844L10.35 5.52187C10.564 5.30777 10.8445 5.2007 11.1246 5.2007C11.7098 5.2007 12.2203 5.67219 12.2203 6.2968C12.2203 6.57727 12.1133 6.85773 11.8993 7.0718L6.33676 12.6343C6.18234 12.7887 6.10512 12.9918 6.10512 13.1948C6.10512 13.6523 6.47852 13.9874 6.8977 13.9874C7.1007 13.9874 7.30355 13.91 7.45863 13.7553L15.0211 6.18887C15.468 5.7416 15.7141 5.14707 15.7141 4.51543C15.7141 3.40762 14.8723 2.17051 13.3485 2.17051C12.7352 2.17051 12.1215 2.39422 11.6743 2.84121L3.4375 11.0781C2.69336 11.8227 2.28359 12.8121 2.28359 13.8648C2.28359 15.7113 3.68633 17.7684 6.225 17.7684C7.2457 17.7684 8.26719 17.3965 9.01172 16.6523L15.2422 10.418C15.4562 10.2039 15.7367 10.0968 16.0168 10.0968C16.602 10.0968 17.1125 10.5683 17.1125 11.1929C17.1125 11.4734 17.0055 11.7539 16.7914 11.9679L10.561 18.2023C9.40234 19.3633 7.86328 20 6.19141 20Z"
                              fill="#0F393B"
                           />
                        </svg>
                     </label>
                     <input
                        onChange={(e) => dispatch({ changeTaskFile: { id: "", e: e as any as Event } })}
                        // @change="(e) => store.commit('changeTaskFile', { id: '', e })"
                        type="file"
                        id="file-input"
                        style={{ display: "none" }}
                     />
                  </div>

                  <svg
                     onClick={hideTaskdetails}
                     width="21"
                     height="22"
                     viewBox="0 0 21 22"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path d="M19.5 2L19.5 20" stroke="#0F393B" stroke-width="2.5" stroke-linecap="round" />
                     <path
                        d="M0 11.5H15M15 11.5L10.5 7M15 11.5L10.5 16"
                        stroke="#0F393B"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                     />
                  </svg>
               </div>
            </div>
         )}

         {state.showTaskDetails && (
            <div className="body" v-if="state.showTaskDetails">
               <div className="title">{activeTask.text}</div>
               <div className="details-table">
                  <div className="details-label">Assignee</div>
                  {taskDetails.user?.id !== "-1" && (
                     <div className="assignee" v-if="getTaskDetails.user.id !== '-1'">
                        <img src={taskDetails?.user?.img} />
                        <div>{taskDetails?.user?.name}</div>
                     </div>
                  )}
                  {taskDetails.user?.id === "-1" && (
                     <div className="assignee" v-if="getTaskDetails.user.id === '-1'">
                        None
                     </div>
                  )}

                  <div className="details-label">Date</div>
                  <div className="date-wrapper">
                     <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M6.78571 2.875H13.2143V1.07812C13.2143 0.48291 13.692 0 14.2857 0C14.8795 0 15.3571 0.48291 15.3571 1.07812V2.875H17.1429C18.7188 2.875 20 4.16201 20 5.75V20.125C20 21.7107 18.7188 23 17.1429 23H2.85714C1.27902 23 0 21.7107 0 20.125V5.75C0 4.16201 1.27902 2.875 2.85714 2.875H4.64286V1.07812C4.64286 0.48291 5.12054 0 5.71429 0C6.30804 0 6.78571 0.48291 6.78571 1.07812V2.875ZM2.14286 20.125C2.14286 20.5203 2.4625 20.8438 2.85714 20.8438H17.1429C17.5357 20.8438 17.8571 20.5203 17.8571 20.125V8.625H2.14286V20.125Z"
                           fill="#0F393B"
                        />
                     </svg>
                     <div style={{ display: "flex", alignItems: "center" }}>
                        From
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DesktopDatePicker
                              minDate={new Date().setMonth(new Date().getMonth() - 3)}
                              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
                              open={showFrom}
                              onOpen={() => setShowFrom(true)}
                              onClose={() => setShowFrom(false)}
                              renderInput={(params) => (
                                 <>
                                    <TextField
                                       style={{ padding: 0, height: 0, width: 0, opacity: 0 }}
                                       variant="standard"
                                       {...params}
                                       InputProps={{ endAdornment: null }}
                                       onClick={() => {
                                          setShowFrom(!showFrom);
                                       }}
                                    ></TextField>
                                    <b onClick={() => setShowFrom(!showFrom)}>
                                       &nbsp;{dateToString((params.value as Date) || taskDetails.startDate)}&nbsp;
                                    </b>
                                 </>
                              )}
                              value={taskDetails.startDate}
                              onChange={(date) => onStartDateChange(new Date(date as number))}
                           ></DesktopDatePicker>
                        </LocalizationProvider>
                        to
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DesktopDatePicker
                              minDate={new Date().setMonth(new Date().getMonth() - 3)}
                              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
                              open={showTo}
                              onOpen={() => setShowTo(true)}
                              onClose={() => setShowTo(false)}
                              renderInput={(params) => (
                                 <>
                                    <TextField
                                       style={{ padding: 0, height: 0, width: 0, opacity: 0 }}
                                       variant="standard"
                                       {...params}
                                       InputProps={{ endAdornment: null }}
                                       onClick={() => {
                                          setShowTo(!showTo);
                                       }}
                                    ></TextField>
                                    <b onClick={() => setShowTo(!showTo)}>
                                       &nbsp;{dateToString((params.value as Date) || taskDetails.endDate)}&nbsp;
                                    </b>
                                 </>
                              )}
                              value={taskDetails.endDate}
                              onChange={(date) => onEndDateChange(new Date(date as number))}
                           ></DesktopDatePicker>
                        </LocalizationProvider>
                     </div>
                  </div>
                  <div className="details-label">Task name</div>
                  <div
                     contentEditable="true"
                     //    @blur="(e) => store.commit('updateTaskText', { id: getActiveTask.id, text: e.target.textContent })"
                  >
                     {activeTask.text}
                  </div>
                  <div className="details-label">Dependencies</div>

                  <div className="add-deps">
                     <div ref={addDepsRef} className="add-deps-heading" onClick={() => setShowDeps(!showDeps)}>
                        Add Dependendcies
                     </div>
                     <Menu
                        className="deps-menu-wrapper"
                        onClose={() => setShowDeps(false)}
                        open={showDeps}
                        anchorEl={addDepsRef.current}
                     >
                        {taskList.map((task) => (
                           <MenuItem
                              onClick={() => {
                                 addLink(task.id);
                                 setShowDeps(false);
                              }}
                              className={classNames({ active: task.active })}
                           >
                              {task.text}
                           </MenuItem>
                        ))}
                     </Menu>
                     {/* <el-dropdown :hide-on-click="true" trigger="click" @command="addLink" placement="bottom-start">
                  <span className="el-dropdown-link">Add Dependencies</span>
                  <el-dropdown-menu className="deps-menu" slot="dropdown">
                     <el-dropdown-item
                        :command="task.id"
                        v-for="task in getTaskList"
                        className="{ active: Boolean(task.active) }"
                        >{{ task.text }}</el-dropdown-item
                     >
                  </el-dropdown-menu>
               </el-dropdown> */}
                  </div>
               </div>
               <div className="desc-label">
                  <b>Description</b>
               </div>
               <input
                  value={activeTask.description || ""}
                  onChange={(e) => changeDescription(e as any as InputEvent)}
                  className="desc"
                  placeholder="Add more details to this task..."
               />
            </div>
         )}

         <div className="subtasks-wrapper">
            <div className="light-text heading">Subtasks</div>
            <div className="subtasks" ref={subtasksWrapperRef}>
               {activeTask.subtasks.map((subtask) => (
                  <div
                     onClick={() => toggleSelection(subtask)}
                     // v-on:click="toggleSelection(subtask)"
                     v-for="subtask in getActiveTask.subtasks"
                     className={classNames("subtask", { completed: subtask.isCompleted, selected: subtask.selected })}
                  >
                     <div className="left">
                        <i
                           className="fas fa-close"
                           onClick={() => dispatch({ deleteSubtask: subtask.id })}
                           // @click.stop="store.commit('deleteSubtask', subtask.id)"
                        ></i>

                        {subtask.isCompleted && (
                           <svg
                              // v-on:click="(e) => toggleCompleted(e, subtask)"
                              // v-if="subtask.isCompleted"
                              onClick={(e) => toggleCompleted(e as any as Event, subtask)}
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <circle cx="12.5" cy="12.5" r="12.5" fill="#33B08E" />
                              <path
                                 d="M7 12L10.5 15.5L17 9"
                                 stroke="#F5F3EE"
                                 stroke-width="1.5"
                                 stroke-linejoin="round"
                              />
                           </svg>
                        )}

                        {!subtask.isCompleted && (
                           <svg
                              // v-if="!subtask.isCompleted"
                              // v-on:click="(e) => toggleCompleted(e, subtask)"
                              onClick={(e) => toggleCompleted(e as any as Event, subtask)}
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <circle cx="12.5" cy="12.5" r="11.75" stroke="#0F393B" stroke-width="1.5" />
                              <path
                                 d="M7 12L10.5 15.5L17 9"
                                 stroke="#0F393B"
                                 stroke-width="1.5"
                                 stroke-linejoin="round"
                              />
                           </svg>
                        )}

                        <input
                           className="subtask-input"
                           onChange={(e) => onSubtaskValueChange(e as any as Event, subtask)}
                           value={subtask.text}
                           // v-on:change="(e) => onSubtaskValueChange(e, subtask)"
                           // :value="subtask.text"
                        />
                     </div>
                     <div className="right">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DesktopDatePicker
                              minDate={new Date().setMonth(new Date().getMonth() - 3)}
                              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
                              open={Boolean(subtask.showDatePicker)}
                              onOpen={() => dispatch({ updateSubTask: { id: subtask.id, showDatePicker: true } })}
                              onClose={() => dispatch({ updateSubTask: { id: subtask.id, showDatePicker: false } })}
                              renderInput={(params) => (
                                 <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                    <TextField
                                       style={{ padding: 0, height: 0, width: 0, opacity: 0 }}
                                       variant="standard"
                                       {...params}
                                       onClick={() => {
                                          dispatch({
                                             updateSubTask: { id: subtask.id, showDatePicker: !subtask.showDatePicker },
                                          });
                                       }}
                                    ></TextField>
                                    <b
                                       onClick={() =>
                                          dispatch({
                                             updateSubTask: { id: subtask.id, showDatePicker: !subtask.showDatePicker },
                                          })
                                       }
                                    >
                                       &nbsp;
                                       {subtask.date ? dateToString(new Date(subtask.date) as Date) : ""}
                                       &nbsp;
                                    </b>
                                    <IconButton
                                       style={{ padding: 0 }}
                                       onClick={() =>
                                          dispatch({
                                             updateSubTask: { id: subtask.id, showDatePicker: !subtask.showDatePicker },
                                          })
                                       }
                                    >
                                       <Icon>
                                          <CalendarTodayIcon></CalendarTodayIcon>
                                       </Icon>
                                    </IconButton>
                                 </div>
                              )}
                              value={subtask.date}
                              onChange={(date) => onSubtaskDateChange(subtask, new Date(date as number))}
                           ></DesktopDatePicker>
                        </LocalizationProvider>
                        <IconButton
                           ref={subtask.userIconEl}
                           onClick={(e) => {
                              if (!subtask.showPopup) {
                                 popupAnchorRef.current = e.target as HTMLDivElement;
                              }
                              dispatch({ updateSubTask: { id: subtask.id, showPopup: !subtask.showPopup } });
                           }}
                        >
                           <PersonOutlineIcon></PersonOutlineIcon>
                        </IconButton>
                        <Popover
                           open={Boolean(subtask.showPopup)}
                           onClose={() => dispatch({ updateSubTask: { id: subtask.id, showPopup: false } })}
                           className="subtask-popup"
                           anchorEl={popupAnchorRef.current}
                           PaperProps={{
                              className: "subtask-popup subtask-popper",
                              style: { borderRadius: "10px", width: 600 },
                           }}
                           anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                           }}
                        >
                           <Autocomplete
                              sx={{ width: "100%", border: "none", outline: "none" }}
                              fullWidth
                              classes={{ popper: "test" }}
                              popupIcon={<></>}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    inputProps={{ ...params.inputProps }}
                                    style={{ border: "none", outline: "none" }}
                                 ></TextField>
                              )}
                              value={data.options.find((x) => x.id === subtask.userId)}
                              // inputValue={state.allUsers.find((x) => x.id === subtask.userId)?.name || ""}
                              onChange={(_, option) => {
                                 dispatch({ updateSubTask: { id: subtask.id, userId: option?.id } });
                              }}
                              options={data.options}
                              getOptionLabel={(option) => option.name}
                              renderOption={(params, option) => (
                                 <li {...params} className="subtask-select-item user-select-item">
                                    <img src={option.img}></img>
                                    <div>{option.name}</div>
                                    <div className="email">{option.email}</div>
                                 </li>
                              )}
                           ></Autocomplete>
                           or
                           <div
                              style={{ whiteSpace: "nowrap", marginRight: "0.4rem" }}
                              className="btn"
                              onClick={() => {
                                 assignSubTaskToMe(subtask);

                                 // dispatch({ updateSubTask: { id: subtask.id, showPopup: false } });
                              }}
                           >
                              Assign to Me
                           </div>
                        </Popover>
                        {/* <el-popover placement="top" width="200" trigger="click">
                     <div className="subtask-popup">
                        <el-select
                           no-match-text="No user found"
                           popper-className="subtask-popper"
                           placement="bottom/left"
                           v-model="subtask.userId"
                           filterable
                           remote
                           reserve-keyword
                           placeholder="Name or email"
                           :remote-method="remoteMethod"
                           :loading="loading"
                        >
                           <el-option v-for="user in options" :key="user.id" :label="user.name" :value="user.id">
                              <div className="subtask-select-item">
                                 <img v-if="subtask.userId !== user.id" :src="user.img" />
                                 <i v-else className="el-icon-user-solid"></i>
                                 <div>{{ user.name }}</div>
                                 <div className="email">{{ user.email }}</div>
                              </div>
                           </el-option>
                           <div slot="empty">No User found</div>
                        </el-select>
                        <div>or</div>
                        <div className="btn" v-on:click="assignSubTaskToMe(subtask)">Assign to Me</div>
                     </div>

                     <svg
                        v-if="subtask.userId === undefined"
                        @click.stop="(e) => e.stopPropagation()"
                        width="15"
                        height="18"
                        viewBox="0 0 15 18"
                        fill="none"
                        slot="reference"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M9.10714 10.6875H5.89286C2.63839 10.6875 0 13.4578 0 16.875C0 17.4962 0.479799 18 1.07143 18H13.9286C14.5202 18 15 17.4962 15 16.875C15 13.4578 12.3616 10.6875 9.10714 10.6875ZM1.64029 16.3125C1.9048 14.0941 3.70982 12.375 5.89286 12.375H9.10714C11.2888 12.375 13.0949 14.0959 13.3594 16.3125H1.64029ZM7.5 9C9.86685 9 11.7857 6.9852 11.7857 4.5C11.7857 2.0148 9.86685 0 7.5 0C5.13315 0 3.21429 2.0148 3.21429 4.5C3.21429 6.98555 5.13281 9 7.5 9ZM7.5 1.6875C8.9769 1.6875 10.1786 2.94926 10.1786 4.5C10.1786 6.05074 8.9769 7.3125 7.5 7.3125C6.0231 7.3125 4.82143 6.05039 4.82143 4.5C4.82143 2.94926 6.02344 1.6875 7.5 1.6875Z"
                           fill="#0F393B"
                        />
                     </svg>
                     <img
                        slot="reference"
                        @click.stop="(e) => e.stopPropagation()"
                        v-if="subtask.userId"
                        :src="getImageForSubtask(subtask)"
                     />
                  </el-popover> */}
                     </div>
                  </div>
               ))}
            </div>
            <div className="btn" onClick={addSubtask}>
               + Add subtask
            </div>
         </div>
      </div>
   );
};

export default TaskDetails;

/* export default TaskDetails;


import Vue To "vue";
import { MyStore } from "..";
import DatePicker from "./DatePicker.vue";

export default Vue.extend({
   name: "TaskDetails",
   data() {
   },
   methods: {
   },
   components: {},
}); */
