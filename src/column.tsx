import React from "react";
import { Task } from "./task";
import { Droppable } from "react-beautiful-dnd";
import { AddTask } from "./components/add-task";

export const Column = ({ column, tasks, onDeleteTask, onAddNewTask }) => {
  return (
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
              <Task
                key={task.id}
                task={task}
                index={index}
                onDeleteTask={onDeleteTask}
                columnId={column.id}
              />
            ))}
            {provided.placeholder}
            <AddTask onAdd={(text) => onAddNewTask(text, column.id)} />
          </div>
        )}
      </Droppable>
    </div>
  );
};
