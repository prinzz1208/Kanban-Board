import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";

export const AddTask = ({ onAdd }) => {
  const [active, setActive] = useState(false);
  const [newTask, setNewTask] = useState("");

  const onSubmit = () => {
    onAdd(newTask);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (active) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [active]);

  return (
    <div
      className="task add-task"
      onClick={() => {
        setActive(true);
      }}
    >
      {active ? (
        <Form.Control
          ref={inputRef}
          type="text"
          value={newTask}
          onBlur={() => {
            setActive(false);
            setNewTask("");
          }}
          onChange={(e) => setNewTask(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
              setActive(false);
            } else if (e.key === "Escape") {
              setActive(false);
            }
          }}
        />
      ) : (
        <i className="bi bi-plus"></i>
      )}
    </div>
  );
};
