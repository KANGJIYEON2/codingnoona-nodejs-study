import React, { useEffect, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const TodoPage = ({ user, setUser }) => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const navigate = useNavigate();

  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTodo = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        getTasks();
      }
      setTodoValue("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container>
      <Row className="justify-content-between align-items-center mb-3">
        <Col>
          <h1>Todo List</h1>
        </Col>
        <Col xs="auto">
          {user ? (
            <Button onClick={handleLogout} className="button-primary">
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="button-primary"
            >
              Login
            </Button>
          )}
        </Col>
      </Row>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            onChange={(event) => setTodoValue(event.target.value)}
            className="input-box"
            value={todoValue}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button onClick={addTodo} className="button-add">
            추가
          </button>
        </Col>
      </Row>

      <TodoBoard
        todoList={todoList}
        deleteItem={deleteItem}
        toggleComplete={toggleComplete}
      />
    </Container>
  );
};

export default TodoPage;
