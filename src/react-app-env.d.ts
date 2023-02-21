/// <reference types="react-scripts" />
interface ITask {
   row: number;
   startCol: number;
   endCol: number;
   selected: boolean;
   text: string;
   id: string;
   moving?: boolean;
   userId?: string;
   priority?: number;
   description?: string;
   subtasks: ISubTask[];
   completed: boolean;
   fileList: { name: string; url: string }[];
}

interface ISubTask {
   id: string;
   text: string;
   isCompleted: boolean;
   userId?: string;
   date?: Date;
   selected: boolean;
   showDatePicker?: boolean;
   showPopup?: boolean;
   showDropdown?: boolean;
   userIconEl?: React.Ref;
}

interface IUser {
   img: string;
   name: string;
   id: string;
   noOfRows: number;
   startRow: number;
   endRow: number;
   email: string;
}
interface IUserSmall {
   img: string;
   name: string;
   id: string;
   email: string;
}

interface ILink {
   task1: string;
   task2: string;
   point1: [number, number];
   point2: [number, number];
   id: string;
   midPoint: [number, number];
   trianglePoints: string;
   path: string;

   // x: number;
   // y: number;
}

interface IState {
   projects: IProject[];
   activeProjectId: string;
   resizingTask?: boolean;
   resizingDir?: MoverDirection;
   movingTask?: boolean;
   grabColOffset?: number;
   movingArrow?: string;
   movingCircle?: string;
   mouse: { x: number; y: number };
   gridScrollX: number;
   currentUserId: string;
   showTaskDetails: boolean;
   taskMoved: boolean;
   newProjectDialog: boolean;
   mouseDownPos: { x: number; y: number };
   allUsers: IUserSmall[];
}
interface IProject {
   name: string;
   startDate: Date;
   endDate: Date;
   users: IUser[];
   tasks: ITask[];
   id: string;
   links: ILink[];
}
type MoverDirection = "right" | "left";
