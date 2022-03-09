import "./assets/scss/main.scss";
import React, { useState } from "react";
import { intialData } from "./constants";
import { Column } from "./column";
import { DragDropContext } from "react-beautiful-dnd";

export const App = () => {
  const [data, setData] = useState(intialData);
  const onDragEnd = (result) => {
    // TODO: reorder our column
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };
    setData(newState);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          return <Column column={column} tasks={tasks} />;
        })}
      </div>
    </DragDropContext>
  );
};
