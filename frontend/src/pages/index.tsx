import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField
} from '@material-ui/core';
import { Todo } from "../components/Todo"
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from "yup";
import { useRouter } from 'next/router'
import { display, textAlign } from "@mui/system";

const createFormSchema = object().required().shape({
  name: string().required('名前を入力してください').max(20, '20文字以下で入力してください'),
  description: string().max(20, '20文字以下で入力してください')
})

export default function App() {
  const createForm = useForm({resolver: yupResolver(createFormSchema)});

  const [todos, setTodos] = useState<{
    id: string;
    name: string;
    description: string;
  }[]>([]);

  const getTodos = async () => {
    try {
      const result = await axios.get('http://localhost:8888/api/rest/tasks',
    {
      headers: { "x-hasura-admin-secret": "secret" }
    }
      )
      setTodos(result.data.tasks);
      console.log(result.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  const handleSaveTodo = async (args: FieldValues) => {
    try {
      const {name, description} = args as {name: string, description: string};
      const id = Math.random().toString(36).substring(2, 12);
      const url = "http://localhost:8888/api/rest/tasks";
      const res = await axios.post(
        url,
        {
          name,
          description
        },
        {
          headers: { "x-hasura-admin-secret": "secret" }
        }
      );
      console.log(res.data);
      setTodos([...todos, {id, name, description}]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="sm" style={{ marginTop: "50px" ,textAlign: "center" }}>
        <form onSubmit={createForm.handleSubmit(data =>{
          handleSaveTodo(data)
        })}>
        <Container component="div">
          <TextField variant="outlined" label="名前" type="text" {...createForm.register("name")} />
          {/* React Hook Form の useForm() 時に定義したバリデーション失敗時のエラーメッセージ */}
          <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
            createForm.formState.errors.name?.message as unknown as string
          }</span></div>

          <TextField variant="outlined" label="詳細" type="text" {...createForm.register("description")} />
          {/* React Hook Form の useForm() 時に定義したバリデーション失敗時のエラーメッセージ */}
          <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
            createForm.formState.errors.description?.message as unknown as string
          }</span></div>
          <Button type="submit" variant="contained" color="primary">作成</Button>
        </Container>

        </form>
        <Container component="div" style={{ marginTop: "50px"}}>
          <List component="ul">
            {todos.map((todo) => {
              <Todo id ={todo.id} name = {todo.name} description = {todo.description}/>;
            })}
          </List>
        </Container>
      </Container>
    </>
  );
}