import React from "react";
import { Task } from "./task";
import { Droppable } from "react-beautiful-dnd";

export const Column = ({ column, tasks }) => (
  <div className="column">
    <div className="title">{column.title}</div>
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          className={"task-list " + (snapshot.isDraggingOver ? "active" : "")}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);
