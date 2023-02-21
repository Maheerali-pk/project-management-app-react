import { alpha, Button, Menu, MenuItem, styled } from "@mui/material";
import classNames from "classnames";
import { useRef, useState } from "react";
import { getters, useGlobalContext } from "../GlobalContext/GlobalContext";
import "./UserList.scss";
interface UserListProps {}

const UserList: React.FC<UserListProps> = () => {
   const [state, dispatch] = useGlobalContext();
   const anchorRef = useRef<HTMLButtonElement>(null);
   const [open, setOpen] = useState(false);
   const getAllUsers = () => {
      const activeProject = getters.getActiveProject(state) as IProject;
      return state.allUsers.map((x) => ({
         ...x,
         active: Boolean(activeProject.users.find((u) => u.id === x.id)),
      }));
   };
   const getUsers = () => {
      const users = getters.getActiveProject(state).users as IUser[];
      return users.map((x, i) => {
         const startRow = users.slice(0, i).reduce((ac, a) => ac + a.noOfRows, 0);
         return { ...x, startRow, endRow: startRow + x.noOfRows };
      });
   };
   const users = getUsers();
   const allUsers = getAllUsers();
   const handleClose = () => {
      setOpen(false);
   };
   return (
      <div className="users-wrapper">
         <div className="btn-wrapper" style={{ position: "relative" }}>
            <div className="btn" onClick={() => dispatch({ addNewTask: undefined })}>
               + Add task
            </div>
            <Button className="btn" ref={anchorRef} style={{ textTransform: "none" }} onClick={() => setOpen(!open)}>
               + Add colleague
            </Button>
            <Menu onClose={handleClose} anchorEl={anchorRef.current} open={open}>
               {allUsers.map((user) => (
                  <MenuItem
                     onClick={() => {
                        dispatch({ addUserToActiveProject: user.id });
                        // handleClose();
                     }}
                     className={classNames("subtask-select-item user-select-item", { active: user.active })}
                  >
                     <img src={user.img}></img>
                     <div>{user.name}</div>
                     <div className="email">{user.email}</div>
                  </MenuItem>
               ))}
            </Menu>
            {/* <el-dropdown @command="(id) => store.commit('addUserToActiveProject', id)" trigger="click">
            <div className="btn el-dropdown-link">+ Add colleague</div>
            <el-dropdown-menu slot="dropdown" className="users-popper">
               <el-dropdown-item
                  :command="user.id"
                  className="subtask-select-item user-select-item"
                  :className="{ active: user.active }"
                  v-for="user in getAllUsers"
               >
                  <img :src="user.img" />
                  <div>{{ user.name }}</div>
                  <div className="email">{{ user.email }}</div>
               </el-dropdown-item>
            </el-dropdown-menu>
         </el-dropdown> */}
         </div>
         <div className="users">
            {users.map((user) => (
               <div style={{ gridRow: `span ${user.noOfRows}` }} className="user" v-for="user in getUsers">
                  <div className="user-body">
                     <img src={user.img} style={{ visibility: user.id === "-1" ? "hidden" : "initial" }} />
                     <div>{user.name}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

{
   /* <script lang="ts">
import store from "@/store";
import { getMonthListBetweenDates, getLinePath, getTrianglePoints, getMousePos } from "@/utils/helpers";
import Vue from "vue";
import { MyStore } from "..";

export default Vue.extend({
   name: "UsersList",

   data() {
      return { size: 10 };
   },

   methods: {
   },
   computed: {
   },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style> */
}

export default UserList;
