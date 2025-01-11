import React from "react";
import PropTypes from "prop-types";
import { List } from "@mui/material";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, staff, onUpdateTask }) => (
  <List>
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} staff={staff} onUpdateTask={onUpdateTask} />
    ))}
  </List>
);

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.string,
    })
  ).isRequired,
  staff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      function: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdateTask: PropTypes.func.isRequired,
};

export default TaskList;
