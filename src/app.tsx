import "./assets/scss/main.scss";
import React, { useEffect, useRef, useState } from "react";
import { initialData, initialData2 } from "./constants";
import { Column } from "./column";
import { DragDropContext } from "react-beautiful-dnd";
import { getFirestoreInstance, initializeFirestore } from "./db";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  setDoc,
} from "firebase/firestore";

export const App = () => {
  const [data, setData] = useState(initialData2);
  const [DocId, setDocId] = useState("");
  const db = useRef(getFirestoreInstance());
  const collRef = useRef<CollectionReference<DocumentData>>();

  useEffect(() => {
    collRef.current = collection(getFirestoreInstance(), "init");

    if (collRef.current) {
      // addDoc(collRef.current, initialData).then((doc) => {
      //   console.log("Document written with ID: ", doc.id);
      //   // setDocId(doc.id);
      // });
      getDocs(collRef.current).then((docs) => {
        docs.forEach((doc) => {
          const initData = doc.data();
          if (initData && initData.id === 1) {
            setDocId(doc.id);
            setData(initData as any);
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    if (data && collRef.current && DocId) {
      console.log("setDoc");

      setDoc(doc(collRef.current, DocId), data).then((doc) => {
        console.log(doc);
      });
    }
  }, [data]);

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

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
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
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  const onDeleteTask = (columnId, taskId) => {
    {
      const newData = { ...data };
      newData.columns[columnId].taskIds = newData.columns[
        columnId
      ].taskIds.filter((id) => id !== taskId);
      delete newData.tasks[taskId];
      setData(newData);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          return (
            <Column column={column} tasks={tasks} onDeleteTask={onDeleteTask} />
          );
        })}
      </div>
    </DragDropContext>
  );
};
