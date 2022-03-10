import React from "react";
import { Draggable } from "react-beautiful-dnd";
export const Task = ({ task, index, onDeleteTask, columnId }) => {
  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            className={"task " + (snapshot.isDragging ? "active" : " ")}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <span>{task.content}</span>
            <i
              className="bi bi-trash"
              onClick={() => onDeleteTask(columnId, task.id)}
            ></i>
          </div>
        )}
      </Draggable>
    </>
  );
};
