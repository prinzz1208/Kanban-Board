import "./assets/scss/main.scss";
import React, { useEffect, useRef, useState } from "react";
import { initialData, initialData2 } from "./constants";
import { Column } from "./column";
import { DragDropContext } from "react-beautiful-dnd";
import { getFirestoreInstance, initializeFirebase } from "./db";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { LoginModal } from "./components/login-modal";
import { User } from "firebase/auth";
import { generateUUID } from "./helpers";

export const App = () => {
  const [data, setData] = useState(initialData2);
  const [DocId, setDocId] = useState("");
  const db = useRef(getFirestoreInstance());
  const collRef = useRef<CollectionReference<DocumentData>>();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    collRef.current = collection(getFirestoreInstance(), "board");

    if (!localStorage.getItem("userId")) {
      setShowLogin(true);
    } else {
      onUserLogin({ uid: localStorage.getItem("userId")?.toString() });
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

  const onUserLogin = (user: Partial<User>) => {
    if (collRef.current) {
      getDocs(collRef.current).then((docs) => {
        docs.forEach((doc) => {
          const initData = doc.data();
          if (initData && user.uid && initData.id === user.uid) {
            setDocId(user.uid);
            setData(initData as any);
            localStorage.setItem("userId", user.uid);
          }
        });
      });
    }
    setShowLogin(false);
  };

  const onSignupUser = (user: User) => {
    if (collRef.current) {
      const dataToSet = { ...initialData2 };
      dataToSet.id = user.uid;
      addDoc(collRef.current, dataToSet).then((doc) => {
        console.log("Document written with ID: ", doc.id);
        setDocId(doc.id);
      });
    }
    setShowLogin(false);
  };

  const onAddNewTask = (text: string, columnId) => {
    const newData = { ...data };
    const uuid = generateUUID();
    const task = { id: uuid, content: text };
    newData.tasks[uuid] = task;
    newData.columns[columnId].taskIds.push(uuid);

    setData(newData);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {data.columnOrder.map((columnId, key) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return (
              <Column
                key={`${columnId} + ${key}`}
                column={column}
                tasks={tasks}
                onDeleteTask={onDeleteTask}
                onAddNewTask={onAddNewTask}
              />
            );
          })}
        </div>
      </DragDropContext>
      {showLogin && (
        <LoginModal onUserLogin={onUserLogin} onSignupUser={onSignupUser} />
      )}
    </>
  );
};
