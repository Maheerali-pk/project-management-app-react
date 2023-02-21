import { Button, Dialog, Input, Menu, MenuItem, TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { useRef, useState } from "react";
import { getters, useGlobalContext } from "../GlobalContext/GlobalContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./SubHeader.scss";
import "../global.scss";
import classNames from "classnames";
import { AddCircleOutline, SearchOutlined } from "@mui/icons-material";

interface SubHeaderProps {}

const SubHeader: React.FC<SubHeaderProps> = () => {
   const [state, dispatch] = useGlobalContext();
   const [projectName, setProjectName] = useState("");
   const [showMenu, setShowMenu] = useState(false);
   const menuLinkRef = useRef<HTMLDivElement>(null);
   const activeProject = getters.getActiveProject(state);
   const projects = state.projects;
   const selectProject = (id: string) => {
      console.log("project selecte", id);
      if (id === "new") {
         dispatch({ openProjectDialog: undefined });
      } else {
         dispatch({ selectProjectById: id });
      }
   };
   const createNewProject = () => {
      dispatch({ createNewProject: projectName });
   };
   return (
      <div className="sub-header">
         <Dialog
            open={state.newProjectDialog}
            onClose={() => dispatch({ setState: { newProjectDialog: false } })}
            maxWidth="md"
         >
            <div className="project-dialog">
               <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && createNewProject}
                  placeholder="Enter Project Name"
               />
               <div className="footer-wrapper">
                  <span slot="footer" className="dialog-footer">
                     <div className="btn-cancel" onClick={() => dispatch({ setState: { newProjectDialog: false } })}>
                        Cancel
                     </div>
                     <div
                        className="btn-save"
                        onClick={() => {
                           createNewProject();
                           dispatch({ setState: { newProjectDialog: false } });
                        }}
                     >
                        Save
                     </div>
                  </span>
               </div>
            </div>
         </Dialog>
         <div className="dropdown-link" onClick={() => setShowMenu(!showMenu)} ref={menuLinkRef}>
            {activeProject.name}
            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
         </div>
         <Menu
            PaperProps={{ style: { width: 400 }, className: "project-dropdown-menu" }}
            open={showMenu}
            anchorEl={menuLinkRef.current}
            onClose={() => setShowMenu(false)}
         >
            {projects.map((project) => (
               <MenuItem
                  className="dropdown-item"
                  onClick={() => {
                     selectProject(project.id);
                     setShowMenu(false);
                  }}
               >
                  <div className={classNames("item-content", { active: project.id === activeProject.id })}>
                     <div>{project.name}</div>

                     {project.id === activeProject.id && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M17.9578 20.9996H2.95781V5.99959H10.275L13.275 2.99959H2.95781C1.34297 2.99959 0 4.34256 0 5.99959V20.9996C0 22.6566 1.34297 23.9996 2.95781 23.9996H17.9156C19.5722 23.9996 20.8734 22.6566 20.8734 20.9996L20.8733 10.6824L17.9154 13.6819V20.9996H17.9578ZM23.3391 1.97725L22.0205 0.658188C21.1416 -0.220718 19.717 -0.220718 18.8386 0.658188L17.0283 2.46897L21.5287 6.96944L23.3391 5.15866C24.2203 4.28069 24.2203 2.85616 23.3391 1.97725ZM6.90469 12.8621L6.01219 17.3255C5.93353 17.7191 6.28055 18.0662 6.67406 17.9874L11.138 17.0949C11.3558 17.0513 11.5557 16.9443 11.7127 16.7873L20.4689 8.03106L15.9684 3.53059L7.20938 12.2902C7.05469 12.4449 6.94688 12.6465 6.90469 12.8621Z"
                              fill="#0F393B"
                           />
                        </svg>
                     )}
                  </div>
               </MenuItem>
            ))}
            <MenuItem
               className="dropdown-item create-new"
               onClick={() => {
                  selectProject("new");
                  setShowMenu(false);
               }}
            >
               <div className={classNames("item-content")} style={{ justifyContent: "start", gap: "0.5rem" }}>
                  <AddCircleOutline></AddCircleOutline>
                  <div>Create new project</div>
               </div>
            </MenuItem>
         </Menu>
         <div className="right">
            <div className="imgs">
               {activeProject.users.map((user, i) =>
                  user.id !== "-1" ? (
                     <img
                        src={user.img}
                        alt=""
                        style={{
                           zIndex: activeProject.users.length - i,
                        }}
                     />
                  ) : null
               )}
            </div>
            <Input startAdornment={<SearchOutlined></SearchOutlined>} disableUnderline className="search-input"></Input>
         </div>
         {/* <el-dialog
         custom-className="project-dialog"
         title="Project Details"
         :visible.sync="store.state.newProjectDialog"
         width="30%"
         :show-close="false"
      >
      </el-dialog>
      <el-dropdown @command="selectProject" placement="bottom-start" class="project-dropdown" trigger="click">
         <span class="el-dropdown-link"
            >{{ getActiveProject.name }}<i class="el-icon-arrow-down el-icon--right"></i>
         </span>
         <el-dropdown-menu class="project-dropdown-menu" slot="dropdown">
            <el-dropdown-item
               class="dropdown-item"
               :class="{ active: project.id === getActiveProject.id }"
               :command="project.id"
               v-for="project in getProjects"
               ><div class="item-content">
                  <div>{{ project.name }}</div>

                  <svg
                     v-if="project.id === getActiveProject.id"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M17.9578 20.9996H2.95781V5.99959H10.275L13.275 2.99959H2.95781C1.34297 2.99959 0 4.34256 0 5.99959V20.9996C0 22.6566 1.34297 23.9996 2.95781 23.9996H17.9156C19.5722 23.9996 20.8734 22.6566 20.8734 20.9996L20.8733 10.6824L17.9154 13.6819V20.9996H17.9578ZM23.3391 1.97725L22.0205 0.658188C21.1416 -0.220718 19.717 -0.220718 18.8386 0.658188L17.0283 2.46897L21.5287 6.96944L23.3391 5.15866C24.2203 4.28069 24.2203 2.85616 23.3391 1.97725ZM6.90469 12.8621L6.01219 17.3255C5.93353 17.7191 6.28055 18.0662 6.67406 17.9874L11.138 17.0949C11.3558 17.0513 11.5557 16.9443 11.7127 16.7873L20.4689 8.03106L15.9684 3.53059L7.20938 12.2902C7.05469 12.4449 6.94688 12.6465 6.90469 12.8621Z"
                        fill="#0F393B"
                     />
                  </svg>
               </div>
            </el-dropdown-item>
            <el-dropdown-item command="new" class="dropdown-item create-new"
               ><div class="item-content">
                  <i class="el-icon-circle-plus-outline"></i>
                  <div>Create new project</div>
               </div></el-dropdown-item
            >
         </el-dropdown-menu>
      </el-dropdown>
      <div class="right">
         <div class="imgs">
            <template v-for="(user, i) in store.getters.getActiveProject.users">
               <img
                  v-if="user.id !== '-1'"
                  :src="user.img"
                  alt=""
                  :style="{
                     zIndex: store.getters.getActiveProject.users.length - i,
                  }"
               />
            </template>
         </div>
         <el-input placeholder="Search" v-model="searchValue">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
         </el-input>
      </div> */}
      </div>
   );
};

export default SubHeader;

{
   /* <template>
</template>

<script lang="ts">
import store from "@/store";
import {
   getMonthListBetweenDates,
   getLinePath,
   getTrianglePoints,
   getMousePos,
   getCompleteDateList,
} from "@/utils/helpers";
import Vue from "vue";
import { MyStore } from "..";
import UsersList from "./UsersList.vue";

export default Vue.extend({
   name: "SubHeader",
   data() {
      return { size: 10, projectName: "", searchValue: "" };
   },

   methods: {
      selectProject(id: string) {
         console.log("project selecte", id);
         if (id === "new") {
            this.store.commit("openProjectDialog", undefined);
         } else {
            this.store.commit("selectProjectById", id);
         }
      },
      createNewProject() {
         this.store.commit("createNewProject", this.projectName);
      },
   },
   computed: {
      getMonthList() {
         const scrollX = this.store.state.gridScrollX;
         const startCol = Math.floor(scrollX / 38);
         const { endDate, startDate } = this.store.getters.getActiveProject;
         const dateList = getCompleteDateList(startDate, endDate);
         const visibleDates = dateList.slice(startCol);
         // const groupMyMonth = visibleDates.reduce((ac, a) => {

         // }, [])
         // console.log(visibleDates[0].getDate(), "Start Col");
      },
      getTotalDays() {
         const { endDate, startDate } = this.store.getters.getActiveProject;
         return getCompleteDateList(startDate, endDate).length;
      },
      getAllDates() {
         const { endDate, startDate } = this.store.getters.getActiveProject;
         return getCompleteDateList(startDate, endDate);
      },
   },
});
</script> */
}
