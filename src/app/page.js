"use client";
import React from "react";

import Form from "@/components/Form";
import Header from "@/components/Header";
import TODOHero from "@/components/TODOHero";
import TODOList from "@/components/TODOList";
import WalletButton from "@/components/WalletButton";
import styled from "styled-components";

const walletButtonContainer = styled.div`
    position:absolute;
    top:10px;
    rigth:10px;
    z-index:1;
`

function Home() {
  const [todos, setTodos] = React.useState([]);

  // Retrieve data from localStorage when component mounts
  React.useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const todos_completed = todos.filter(
    (todo) => todo.is_completed == true
  ).length;
  const total_todos = todos.length;
  return (
    <div className="wrapper">
      <Header />
      <walletButtonContainer>
        <WalletButton/>
      </walletButtonContainer>
      <TODOHero todos_completed={todos_completed} total_todos={total_todos} />
      <Form todos={todos} setTodos={setTodos} />
      <TODOList todos={todos} setTodos={setTodos} />
    </div>
  );
}

export default Home;
