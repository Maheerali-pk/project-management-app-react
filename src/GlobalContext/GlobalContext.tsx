import React from "react";
import { createCustomContext } from "../Helpers/CreateCustomContext";
import {
   compareDates,
   getCompleteDateList,
   getEndDate,
   getLinePath,
   getStartDate,
   getTrianglePoints,
   getUserWithRow,
} from "../utils/helpers";

const initialState: IState = {
   mouseDownPos: { x: 0, y: 0 },
   activeProjectId: "0",
   mouse: { x: 0, y: 0 },
   gridScrollX: 0,
   currentUserId: "1",
   showTaskDetails: false,
   taskMoved: false,
   newProjectDialog: false,
   allUsers: [
      {
         id: "0",
         img: "https://thumbs.dreamstime.com/b/handsome-man-black-suit-white-shirt-posing-studio-attractive-guy-fashion-hairstyle-confident-man-short-beard-125019349.jpg",
         name: "Jake Gyllenhaal",
         email: "dianelarsson@email..com",
      },
      {
         id: "1",
         img: "https://media.istockphoto.com/photos/smiling-indian-man-looking-at-camera-picture-id1270067126?k=20&m=1270067126&s=612x612&w=0&h=ZMo10u07vCX6EWJbVp27c7jnnXM2z-VXLd-4maGePqc=",
         name: "Llewyn Davies",

         email: "mariakovalchuk@email.com",
      },
      {
         id: "2",
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiewXcyqeDVxaqnyVt9fWQJ8FWlm3YZ0yY6A&usqp=CAU",
         name: "Maria Kovalchuk",
         email: "llewyndavies@email..com",
      },
      {
         id: "3",
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiewXcyqeDVxaqnyVt9fWQJ8FWlm3YZ0yY6A&usqp=CAU",
         name: "Maria Kovalchuk",
         email: "llewyndavies@email..com",
      },
   ],
   projects: [
      {
         id: "1",
         startDate: getStartDate(),
         endDate: getEndDate(),
         links: [],
         name: "Project 2",
         tasks: [],
         users: [{ id: "-1", img: "", name: "Unassigned", noOfRows: 8, startRow: 5, endRow: 13, email: "" }],
      },
      {
         id: "2",
         startDate: getStartDate(),
         endDate: getEndDate(),
         links: [],
         name: "Project 3",
         tasks: [],
         users: [{ id: "-1", img: "", name: "Unassigned", noOfRows: 8, startRow: 5, endRow: 13, email: "" }],
      },
      {
         id: "0",
         startDate: getStartDate(),
         endDate: getEndDate(),
         name: "First project",
         users: [
            {
               id: "0",
               img: "https://thumbs.dreamstime.com/b/handsome-man-black-suit-white-shirt-posing-studio-attractive-guy-fashion-hairstyle-confident-man-short-beard-125019349.jpg",
               name: "Jake Gyllenhaal",
               noOfRows: 1,
               startRow: 1,
               endRow: 2,
               email: "dianelarsson@email..com",
            },
            {
               id: "1",
               img: "https://media.istockphoto.com/photos/smiling-indian-man-looking-at-camera-picture-id1270067126?k=20&m=1270067126&s=612x612&w=0&h=ZMo10u07vCX6EWJbVp27c7jnnXM2z-VXLd-4maGePqc=",
               name: "Llewyn Davies",

               noOfRows: 1,
               startRow: 2,
               endRow: 3,
               email: "mariakovalchuk@email.com",
            },
            {
               id: "2",
               img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiewXcyqeDVxaqnyVt9fWQJ8FWlm3YZ0yY6A&usqp=CAU",
               name: "Maria Kovalchuk",
               startRow: 3,
               endRow: 4,
               noOfRows: 1,
               email: "llewyndavies@email..com",
            },
            {
               id: "3",
               img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiewXcyqeDVxaqnyVt9fWQJ8FWlm3YZ0yY6A&usqp=CAU",
               name: "Maria Kovalchuk",
               startRow: 3,
               endRow: 4,
               noOfRows: 1,
               email: "llewyndavies@email..com",
            },

            { id: "-1", img: "", name: "Unassigned", noOfRows: 8, startRow: 5, endRow: 13, email: "" },
         ],
         tasks: [
            {
               fileList: [],
               completed: false,
               startCol: 1,
               row: 1,
               endCol: 9,
               selected: false,
               text: "Task 1",
               id: "0",
               userId: "0",
               subtasks: [
                  { isCompleted: true, text: "Do this", id: Math.random().toString(), selected: false },
                  { isCompleted: false, text: "Do that", id: Math.random().toString(), selected: false },
                  { isCompleted: false, text: "Don’t do this", id: Math.random().toString(), selected: false },
               ],
            },
            {
               fileList: [],
               startCol: 11,
               row: 2,
               endCol: 17,
               selected: false,
               text: "Task 2",
               id: "1",
               userId: "1",
               subtasks: [],
               completed: false,
            },
            {
               fileList: [],
               startCol: 19,
               row: 3,
               endCol: 25,
               selected: false,
               text: "Task 3",
               id: "2",
               userId: "2",
               subtasks: [],
               completed: false,
            },
            {
               fileList: [],
               startCol: 29,
               row: 1,
               endCol: 40,
               selected: false,
               text: "Task r",
               id: "3",
               userId: "0",
               subtasks: [],
               completed: false,
            },
         ],
         links: [
            {
               task1: "0",
               task2: "1",
               id: "0",
               point1: [0, 0],
               point2: [0, 0],
               midPoint: [0, 0],
               path: "",
               trianglePoints: "",
            },
            {
               task1: "1",
               task2: "2",
               id: "1",
               point1: [0, 0],
               point2: [0, 0],
               midPoint: [0, 0],
               path: "",
               trianglePoints: "",
            },
            {
               task1: "2",
               task2: "3",
               id: "2",
               point1: [0, 0],
               point2: [0, 0],
               midPoint: [0, 0],
               path: "",
               trianglePoints: "",
            },
         ],
      },
   ],
};

const clone = (state: IState): IState => JSON.parse(JSON.stringify(state));
const functions = {
   selectTaskById(state: IState, taskId: string) {
      state = clone(state);
      const activeProject = state.projects.find((x) => x.id === state.activeProjectId);
      if (activeProject) {
         const clickedTask = activeProject.tasks.find((task) => task.id === taskId) as ITask;
         const selectedBefore = clickedTask?.selected;
         activeProject.tasks.forEach((task) => {
            task.selected = false;
         });
         if (selectedBefore && !clickedTask.moving && !state.taskMoved) {
            state.showTaskDetails = true;
         } else {
            state.showTaskDetails = false;
         }
         if (clickedTask) {
            clickedTask.selected = true;
         }
      }
      return state;
   },
   mouseDownOnMover(state: IState, dir: MoverDirection) {
      state = clone(state);
      state.resizingTask = true;
      state.resizingDir = dir;
      return state;
   },
   mouseDownOnTaskBody(state: IState, { task, grabColOffset }: { task: ITask; grabColOffset: number }) {
      state = clone(state);
      getters.getActiveProject(state)?.tasks.forEach((x) => {
         x.moving = false;
      });
      getters.getActiveProject(state).tasks.find((x) => x.id === task.id)!.moving = true;
      // console.log("Mouse down on task", task);
      state.movingTask = true;
      state.grabColOffset = grabColOffset;
      state.mouseDownPos = { ...state.mouse };
      state.taskMoved = false;

      // console.log("mouse down on body");
      return state;
   },
   setState(state: IState, newState: Partial<IState>) {
      return { ...state, ...newState };
   },
   deleteRow(state: IState, row: number) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      activeProject.tasks.filter((x) => x.row > row).forEach((task) => task.row--);
      const userWithDeletedRow = getUserWithRow(state, row);
      userWithDeletedRow!.noOfRows--;
      return state;
   },
   mouseDownOnArrow(state: IState, linkId: string) {
      state = clone(state);
      state.movingArrow = linkId;
      return state;
   },
   mouseDownOnCircle(state: IState, linkId: string) {
      state = clone(state);
      console.log("moving circle changed", linkId);
      state.movingCircle = linkId;
      return state;
   },
   deleteLink(state: IState, linkId: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const index = activeProject.links.findIndex((x) => x.id === linkId);
      activeProject.links.splice(index, 1);
      return state;
   },
   onMouseUp(state: IState, customTask?: ITask) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state) as IProject;
      const changedTask = state.resizingTask
         ? activeProject.tasks.find((x) => x.selected)
         : activeProject.tasks.find((x) => x.moving) || customTask;
      // console.log(changedTask, changedTask);
      if (changedTask) {
         const changedRowTasks = activeProject.tasks.filter((x) => x.row === changedTask.row);
         const isOverlapped = changedRowTasks
            .filter((x) => x.id !== changedTask.id)
            .some((x) => x.startCol < changedTask.endCol && changedTask.startCol < x.endCol);
         const overlappedTask = changedRowTasks
            .filter((x) => x.id !== changedTask.id)
            .find((x) => x.startCol < changedTask.endCol && changedTask.startCol < x.endCol);
         if (isOverlapped) {
            const row = changedTask.row;
            const afterRows = activeProject.tasks.filter((x) => x.row > row);

            const destinationUser = activeProject.users.find((x) => x.id === overlappedTask!.userId);
            // const userIndex = activeProject.users.findIndex((x) => x.id === changedTask.userId);
            // const user = activeProject.users[userIndex];

            destinationUser!.noOfRows++;
            afterRows.forEach((x) => {
               x.row++;
            });

            changedTask.userId = destinationUser!.id;
            changedTask.row++;
         } else {
            const tempUsers = activeProject.users.map((x, i) => {
               const startRow = activeProject.users.slice(0, i).reduce((ac, a) => ac + a.noOfRows, 0) + 1;
               return { ...x, startRow, endRow: startRow + x.noOfRows };
            });
            // console.log(tempUsers);
            const destinationUser = tempUsers.find(
               (x) => x.startRow <= changedTask.row && x.endRow > changedTask.row
            ) as IUser;
            // console.log("destination user", destinationUser);
            changedTask.userId = destinationUser!.id;
            // console.log(changedTask);
         }
         //Remove empty rows
         // activeProject.users.forEach(user => {
         //    if(user.noOfRows > 1){
         //       const emptyRows =
         //    }
         // })

         const totalRows = activeProject.users.reduce((ac, a) => ac + a.noOfRows, 0);
         const allRows = [...Array(totalRows)].map((x, i) => i + 1);
         // console.log(allRows, "All rows");
         const tempUsers = activeProject.users.map((x, i) => {
            const startRow = activeProject.users.slice(0, i).reduce((ac, a) => ac + a.noOfRows, 0) + 1;
            return { ...x, startRow, endRow: startRow + x.noOfRows };
         });
         // console.log(activeProject.users);
         // console.log(tempUsers, "Temp users");
         const emptyRows = allRows.filter((row) => {
            const rowContainsTask = activeProject.tasks.some((x) => x.row === row);
            // console.log("row: ", row, "user", getUserWithRow(state, row));
            const destinationUser = tempUsers.find((x) => x.startRow <= row && x.endRow > row) as IUser;
            const isFirstRow =
               destinationUser.startRow === row && destinationUser.endRow === destinationUser.startRow + 1;
            const isUnassignedRow = destinationUser.id === "-1";

            return !(rowContainsTask || isFirstRow || isUnassignedRow);
         });
         // console.log(emptyRows, "emptyRows");
         emptyRows.forEach((x) => {
            state = functions.deleteRow(state, x);
            // store.commit("deleteRow", x);
         });
      }
      if (state.movingArrow) {
         const col = Math.ceil(state.mouse.x / 38);
         const row = Math.ceil(state.mouse.y / 55);
         const destTask = activeProject.tasks.find((x) => x.row === row && x.startCol <= col && x.endCol > col);
         if (destTask) {
            const changedLink = activeProject.links.find((x) => x.id === state.movingArrow) as ILink;
            if (destTask.id !== changedLink.task1) {
               changedLink.task2 = destTask.id;
            }
         }
      }

      if (state.movingCircle) {
         const col = Math.ceil(state.mouse.x / 38);
         const row = Math.ceil(state.mouse.y / 55);
         const destTask = activeProject.tasks.find((x) => x.row === row && x.startCol <= col && x.endCol > col);
         if (destTask) {
            const changedLink = activeProject.links.find((x) => x.id === state.movingCircle) as ILink;
            if (destTask.id !== changedLink.task2) {
               changedLink.task1 = destTask.id;
            }
         }
      }

      state.resizingTask = false;
      state.movingTask = false;
      getters.getActiveProject(state)?.tasks.forEach((x) => {
         x.moving = false;
      });
      state.movingArrow = undefined;
      state.movingCircle = undefined;
      activeProject.links.forEach((x) => {
         x.point1[0] = 0;
         x.point1[1] = 0;
         x.point2[0] = 0;
         x.point2[1] = 0;
      });
      state.grabColOffset = undefined;
      if (state.mouse.x === state.mouseDownPos.x && state.mouse.y === state.mouseDownPos.y) {
         state.taskMoved = false;
      } else {
         state.taskMoved = true;
      }
      return state;
   },
   updateDateOfSelectedTask(state: IState, payload: { type: "start" | "end"; date: Date }) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const activeTask = activeProject.tasks.find((x) => x.selected) as ITask;
      const allDates = getCompleteDateList(activeProject.startDate, activeProject.endDate);
      const col = allDates.findIndex((x) => compareDates(payload.date, x)) + 1;
      if (payload.type === "end") {
         activeTask.endCol = col + 1;
      } else {
         activeTask.startCol = col;
      }
      state = functions.updateLinks(state);
      // store.commit("updateLinks", undefined);
      return state;
   },
   updateLinks(state: IState) {
      // state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const offsetY = 0;
      activeProject.links.forEach((link) => {
         const task1 = activeProject.tasks.find((x) => x.id === link.task1) as ITask;
         const task2 = activeProject.tasks.find((x) => x.id === link.task2) as ITask;
         let point1 = [task1?.endCol * 38 - 38, task1.row * 55 - 55 / 2 + offsetY] as [number, number];
         let point2 = [task2?.startCol * 38 - 38, task2.row * 55 - 55 / 2 + offsetY] as [number, number];

         if (state.movingCircle === link.id) {
            point1 = [state.mouse.x, state.mouse.y + offsetY];
         }
         if (state.movingArrow === link.id) {
            point2 = [state.mouse.x, state.mouse.y + offsetY];
         }

         link.point1 = point1;
         link.point2 = point2;

         link.midPoint = [
            link.point1[0] + (link.point2[0] - link.point1[0]) / 2,
            link.point1[1] + (link.point2[1] - link.point1[1]) / 2,
         ];

         link.trianglePoints = getTrianglePoints(link.point2[0], link.point2[1]);
         link.path = getLinePath(link.point1[0], link.point1[1], link.point2[0] - 5, link.point2[1]);
         console.log("link.path", link.path);
      });
      return state;
   },
   onMouseMove(state: IState, cell: [number, number]) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const activeTask = getters.getActiveTask(state);
      if (activeTask && state.resizingTask) {
         let startCol = activeTask.startCol;
         let endCol = activeTask.endCol;
         if (state.resizingDir === "left") {
            startCol = Math.ceil(cell[0] / 38);
         }
         if (state.resizingDir === "right") {
            endCol = Math.ceil(cell[0] / 38) + 1;
         }
         if (endCol - startCol <= 0) {
            return;
         }
         activeTask.endCol = endCol;
         activeTask.startCol = startCol;
      }
      if (state.movingTask) {
         const movingTask = getters.getActiveProject(state)?.tasks.find((x) => x.moving);
         if (movingTask) {
            let width = movingTask.endCol - movingTask.startCol;
            let prevStartCol = movingTask.startCol;
            const col = Math.ceil(cell[0] / 38) - (state.grabColOffset as number);
            if (col <= 0) {
               console.log("Col is less than 0");
               return state;
            }
            const row = Math.ceil(cell[1] / 55);
            movingTask.row = row;
            movingTask.startCol = col;
            movingTask.endCol = col + width;
            if (prevStartCol !== movingTask.startCol) {
               const allDates = getCompleteDateList(getStartDate(), getEndDate());
               const scrollX = movingTask.startCol * 38;
               const grid = document.querySelector("#grid-wrapper") as HTMLElement;
               const startCol = Math.floor(grid?.scrollLeft / 38);
               console.log(allDates[startCol], "Start date");
               console.log(startCol, movingTask.startCol - 1);
               const endCol = startCol + Math.floor(grid.clientWidth / 38);

               console.log("endDate", allDates[endCol]);
               if (movingTask.startCol - 1 < startCol) {
                  grid.scrollTo({ left: (movingTask.startCol - 1) * 38, behavior: "smooth" });
               }
               if (movingTask.endCol - 1 > endCol) {
                  grid.scrollTo({
                     left: (movingTask.endCol - 1) * 38 - Math.floor(grid.clientWidth),
                     behavior: "smooth",
                  });
               }
            }
         }
      }

      state.mouse.x = cell[0];
      state.mouse.y = cell[1];
      if (state.movingTask) {
         state.taskMoved = true;
      }
      state = functions.updateLinks(state);
      // store.commit("updateLinks", undefined);
      return state;
   },
   deselectAllTasks(state: IState) {
      state = clone(state);
      // console.log("De select all tasks called");
      const activeProject = state.projects.find((x) => x.id === state.activeProjectId);
      if (activeProject) {
         activeProject.tasks.forEach((task) => {
            task.selected = false;
         });
      }
      state.showTaskDetails = false;
      // console.log("Show task details is changed");
      return state;
   },
   setGridScroll(state: IState, scroll: number) {
      state = clone(state);
      state.gridScrollX = scroll;
      return state;
   },
   addNewTask(state: IState) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const row = activeProject.users.slice(0, -1).reduce((ac, a) => ac + a.noOfRows, 0) + 1;

      const allDates = getCompleteDateList(activeProject.startDate, activeProject.endDate);
      const colNo = allDates.findIndex((x) => compareDates(x, new Date()));
      activeProject.tasks.push({
         fileList: [],
         userId: "-1",
         row,
         id: Math.random().toFixed(10),
         startCol: colNo + 1,
         endCol: colNo + 7,
         text: "New Task",
         selected: false,
         subtasks: [],
         completed: false,
      });
      state = functions.onMouseUp(state, activeProject.tasks[activeProject.tasks.length - 1]);
      // store.commit("onMouseUp", activeProject.tasks[activeProject.tasks.length - 1]);
      return state;
   },
   addLinkToSelectedTask(state: IState, taskId: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      activeProject.links.push({
         id: Math.random().toString(),
         midPoint: [0, 0],
         path: "",
         point1: [0, 0],
         point2: [0, 0],
         task1: selectedTask.id,
         task2: taskId,
         trianglePoints: "",
      });
      state = functions.updateLinks(state);
      // store.commit("updateLinks", undefined);
      return state;
   },
   removeLinkFromSelectedTask(state: IState, taskId: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      const linkToRemove = activeProject.links.findIndex((x) => x.task1 === selectedTask.id && x.task2 === taskId);
      activeProject.links.splice(linkToRemove, 1);
      state = functions.updateLinks(state);
      // store.commit("updateLinks", undefined);
      return state;
   },
   addDescriptionToSelectionTask(state: IState, text: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      selectedTask.description = text;
      return state;
   },
   updateSubTask(state: IState, subtaskProps: Partial<ISubTask>) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      const subtask = selectedTask.subtasks.find((x) => x.id === subtaskProps.id) as ISubTask;
      if (!subtask) return state;
      // console.log(subtask, subtaskProps);
      if (subtaskProps.selected !== undefined) {
         selectedTask.subtasks.forEach((x) => (x.selected = false));
      }
      for (let k in subtaskProps) {
         //@ts-ignore
         subtask[k as keyof ISubTask] = subtaskProps[k as keyof ISubTask];
      }
      return state;
   },
   addSubtaskToSelectedTask(state: IState) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const selectedTask = activeProject.tasks.find((x) => x.selected) as ITask;
      selectedTask.subtasks.push({
         id: Math.random().toString(),
         isCompleted: false,
         selected: false,
         text: "New subtask",
      });
      return state;
   },
   hideTaskDetails(state: IState) {
      state = clone(state);
      state.showTaskDetails = false;
      return state;
   },
   selectProjectById(state: IState, id: string) {
      state = clone(state);
      // console.log("Active project id", id);
      state.activeProjectId = id;
      return state;
   },
   openProjectDialog(state: IState, id?: string) {
      state = clone(state);
      state.newProjectDialog = true;
      return state;
   },
   createNewProject(state: IState, projectName: string) {
      state = clone(state);
      state.newProjectDialog = false;
      state.projects.push({
         id: Math.random().toString(),
         startDate: getStartDate(),
         endDate: getEndDate(),
         links: [],
         name: projectName,
         tasks: [],
         users: [{ id: "-1", img: "", name: "Unassigned", noOfRows: 8, startRow: 5, endRow: 13, email: "" }],
      });
      state.activeProjectId = state.projects.slice(-1)[0].id;
      return state;
   },
   scrollToToday(state: IState) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const allDates = getCompleteDateList(activeProject.startDate, activeProject.endDate);
      const colNo = allDates.findIndex((x) => compareDates(x, new Date()));
      const width = colNo * 38;
      const grid = document.querySelector("#grid-wrapper");
      grid?.scrollTo({ left: width, behavior: "smooth" });
      // console.log(width, "widthg");
      return state;
   },
   toggleCompleteTask(state: IState) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const activeTask = activeProject.tasks.find((x) => x.selected);
      if (activeTask) {
         activeTask.completed = !activeTask.completed;
      }
      return state;
   },
   addUserToActiveProject(state: IState, userId: string) {
      state = clone(state);
      const user = state.allUsers.find((x) => x.id === userId);
      const activeProject = getters.getActiveProject(state);
      const index = activeProject.users.findIndex((x) => x.id === userId);
      if (index === -1) {
         activeProject.users.splice(-1, 0, { ...user, noOfRows: 1, startRow: 0, endRow: 0 } as IUser);
      } else {
         activeProject.users.splice(index, 1);
      }
      state = functions.onMouseUp(state, undefined);
      // store.commit("onMouseUp", undefined);
      return state;
   },
   updateTaskText(state: IState, { id, text }: { text: string; id: string }) {
      state = clone(state);
      const activeTask = getters.getActiveProject(state).tasks.find((x) => x.id === id);
      // console.log("Update task called");
      if (activeTask) {
         console.log("Task text changed");
         activeTask.text = text;
      }
      return state;
   },
   changeTaskFile(state: IState, { e, id }: { id: string; e: Event }) {
      state = clone(state);
      console.log(e, "Event");
      const file = (e.target as HTMLInputElement).files![0];
      const activeProject = getters.getActiveProject(state);
      const task = activeProject.tasks.find((x) => x.selected) as ITask;
      //@ts-ignore
      const objectURL = URL.createObjectURL(file);
      task.fileList.push({ url: objectURL, name: file.name });
      return state;
   },
   deleteSubtask(state: IState, subTaskId: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const task = activeProject.tasks.find((x) => x.selected) as ITask;
      const subtaskIndex = task.subtasks.findIndex((x) => x.id === subTaskId);
      task.subtasks.splice(subtaskIndex, 1);
      return state;
   },
   removeFile(state: IState, fileName: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const task = activeProject.tasks.find((x) => x.selected) as ITask;
      const fileIndex = task.fileList.findIndex((x) => x.name === fileName);
      task.fileList.splice(fileIndex, 1);
      return state;
   },
   removeTask(state: IState, taskId: string) {
      state = clone(state);
      const activeProject = getters.getActiveProject(state);
      const taskIndex = activeProject.tasks.findIndex((x) => x.id === taskId);
      activeProject.tasks.splice(taskIndex, 1);
      activeProject.links = activeProject.links.filter((x) => x.task1 !== taskId && x.task2 !== taskId);
      return state;
   },
};

export const getters = {
   getProjects(state: IState) {
      return state.projects;
   },
   getActiveProject(state: IState) {
      return state.projects.find((x) => x.id === state.activeProjectId) as IProject;
   },
   getActiveTask(state: IState) {
      const activeProject = state.projects.find((x) => x.id === state.activeProjectId);
      return activeProject?.tasks.find((task) => task.selected);
   },
   getMovingTask(state: IState) {
      const activeProject = state.projects.find((x) => x.id === state.activeProjectId);
      return activeProject?.tasks.find((x) => x.moving);
   },
   getLinksWithPaths(state: IState) {
      const activeProject = state.projects.find((x) => x.id === state.activeProjectId);

      console.log("Get links with paths called");
      if (activeProject) {
         const res = activeProject.links.map((link) => {
            const task1 = activeProject.tasks.find((x) => x.id === link.task1) as ITask;
            const task2 = activeProject.tasks.find((x) => x.id === link.task2) as ITask;
            const point1 = [task1?.endCol * 38 - 38, task1.row * 55 - 55 / 2];
            let point2 = [task2?.startCol * 38 - 38, task2.row * 55 - 55 / 2];

            return { ...link, point1, point2 };
         });
         return res;
      }
      return [];
   },
};
const { Context, Provider, useContextHook } = createCustomContext<IState, typeof functions>({
   initialState,
   functions,
});

export const GlobalContextProvider = Provider;
export const useGlobalContext = useContextHook;
