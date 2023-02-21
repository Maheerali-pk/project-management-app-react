const monthList = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const getMonthListBetweenDates = (d1: Date, d2: Date) => {
   const res: Date[] = [];
   d1 = new Date(d1);
   d2 = new Date(d2);
   while (d1.getMonth() !== d2.getMonth() || d1.getFullYear() !== d2.getFullYear()) {
      res.push(new Date(+d1));
      d1.setMonth(d1.getMonth() + 1);
   }
   return res.map((x) => ({
      month: monthList[x.getMonth()],
      year: x.getFullYear(),
      noOfDays: daysInMonth[x.getMonth()],
      monthNo: x.getMonth(),
   }));
};

export const getCompleteDateList = (d1: Date, d2: Date) => {
   const res: Date[] = [];

   d1 = new Date(d1);
   d2 = new Date(d2);
   // console.log(d1.getDate(), d1.getFullYear(), d1.getMonth(), d2.getDate(), d2.getFullYear(), d2.getMonth());
   // console.log(d1, d2);
   let loops = 0;
   while (
      (d1.getDate() !== d2.getDate() || d1.getMonth() !== d2.getMonth() || d1.getFullYear() !== d2.getFullYear()) &&
      loops < 1000
   ) {
      loops++;
      // console.log("finding date");
      res.push(new Date(+d1));
      d1.setDate(d1.getDate() + 1);
   }
   return res;
};

export const getLinePath = (startX: number, startY: number, endX: number, endY: number) => {
   // exemple of a path: M318,345 L330,345 C450,345 380,124 504,124 L519,124

   if (startX > endX) {
      return drawCurve(startX, startY, endX, endY);
   }
   // M
   var AX = startX;
   var AY = startY;

   // L
   var BX = Math.abs(endX - startX) * 0.05 + startX;
   var BY = startY;

   // C
   var CX = (endX - startX) * 0.66 + startX;
   var CY = startY;
   var DX = (endX - startX) * 0.33 + startX;
   var DY = endY;
   var EX = -Math.abs(endX - startX) * 0.05 + endX;
   var EY = endY;

   // L
   var FX = endX;
   var FY = endY;

   // [DEBUGGING] add all the colored points for testing
   // document.getElementById("pointA").setAttribute("cx", AX);
   // document.getElementById("pointA").setAttribute("cy", AY);
   // document.getElementById("pointB").setAttribute("cx", BX);
   // document.getElementById("pointB").setAttribute("cy", BY);
   // document.getElementById("pointC").setAttribute("cx", CX);
   // document.getElementById("pointC").setAttribute("cy", CY);
   // document.getElementById("pointD").setAttribute("cx", DX);
   // document.getElementById("pointD").setAttribute("cy", DY);
   // document.getElementById("pointE").setAttribute("cx", EX);
   // document.getElementById("pointE").setAttribute("cy", EY);
   // document.getElementById("pointF").setAttribute("cx", FX);
   // document.getElementById("pointF").setAttribute("cy", FY);

   // setting up the path string
   var path = "M" + AX + "," + AY;
   path += " L" + BX + "," + BY;
   path += " " + "C" + CX + "," + CY;
   path += " " + DX + "," + DY;
   path += " " + EX + "," + EY;
   path += " L" + FX + "," + FY;

   return path;
};

// draw a curvy line between point (startX,startY) and point (endX,endY)
function drawCurve(startX: number, startY: number, endX: number, endY: number) {
   // exemple of a path: M318,345 L330,345 C450,345 380,124 504,124 L519,124

   // M
   var AX = startX;
   console.log(AX);
   var AY = startY;

   // L
   var BX = Math.abs(endX - startX) * 0.05 + startX;
   var BY = startY;

   // C
   var CX = startX + Math.abs(endX - startX) * 0.33;
   var CY = startY;
   var DX = endX - Math.abs(endX - startX) * 0.33;
   var DY = endY;
   var EX = -Math.abs(endX - startX) * 0.05 + endX;
   var EY = endY;

   // L
   var FX = endX;
   var FY = endY;

   // [DEBUGGING] add all the colored points for testing

   // setting up the path string
   var path = "M" + AX + "," + AY;
   path += " L" + BX + "," + BY;
   path += " " + "C" + CX + "," + CY;
   path += " " + DX + "," + DY;
   path += " " + EX + "," + EY;
   path += " L" + FX + "," + FY;

   // applying the new path to the element
   return path;
}

//drawCurve(200,400, 519,124);
drawCurve(519, 124, 200, 400);

export const getTrianglePoints = (px: number, py: number) => {
   px = px - 0.75;
   const height = 7;
   const base = 10;
   return `${px},${py} ${px - height},${py + base / 2} ${px - height},${py - base / 2}`;
};

export const getMousePos = (e: React.MouseEvent): [number, number] => {
   const wrapper = e.target as HTMLElement;
   const grid = document.querySelector("#grid") as HTMLElement;
   const gridWrapper = document.querySelector("#grid-wrapper") as HTMLElement;
   const { left, top } = grid.getBoundingClientRect();
   return [e.clientX + grid.scrollLeft - left, e.clientY + grid.scrollTop - top];
};
export const scalePoints = (p: [number, number]): [number, number] => {
   const grid = document.querySelector("#grid") as HTMLElement;
   const { left, top } = grid.getBoundingClientRect();
   return [p[0] + grid.scrollLeft - left, p[1] + grid.scrollTop - top];
};
export const getUserWithRow = (state: IState, row: number) => {
   const activeProject = state.projects.find((x) => x.id === state.activeProjectId) as IProject;
   const tempUsers = activeProject.users.map((x, i) => {
      const startRow = activeProject.users.slice(0, i).reduce((ac, a) => ac + a.noOfRows, 0) + 1;
      return { ...x, startRow, endRow: startRow + x.noOfRows };
   });
   const destinationUser = tempUsers.find((x) => x.startRow <= row && x.endRow > row) as IUser;
   return activeProject.users.find((x) => x.id === destinationUser.id);
};

export const areTasksOverlapped = (t1: ITask, t2: ITask) => {};

export const compareDates = (d1: Date, d2: Date) => {
   return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

export const getStartDate = () => {
   const dateNow = new Date();
   dateNow.setMonth(dateNow.getMonth() - 3);
   return dateNow;
};
export const getEndDate = () => {
   const dateNow = new Date();
   dateNow.setMonth(dateNow.getMonth() + 3);
   return dateNow;
};

export const dateToString = (d: Date) => `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
