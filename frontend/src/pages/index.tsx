import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Input,
  ListItemSecondaryAction,
  Checkbox,
  TextField
  } from '@material-ui/core';

import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from "yup";

// 「TODOを新規作成するフォーム」のスキーマを yup で定義する。
const createFormSchema = object().required().shape({
  name: string().required('name is required'), // TODO名のinputタグのモデル。値は文字列であり、必須バリデーションを要する。
  description: string().required('description is required'), // TODOの説明のinputタグのモデル。値は文字列であり、必須バリデーションを要する。
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
      // getTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = (id: string) => {
    axios.delete(`http://localhost:8888/api/rest/tasks/${id}`,
    {
      headers: { "x-hasura-admin-secret": "secret" }
    })
    .then(response => {
      setTodos(todos.filter(todo => todo.id !== id));
      getTodos();
      console.log("set")
    }).catch(data =>  {
      console.log(data)
    })
  }
  return (
    <>
      <Container component="main" maxWidth="xs">
        <form onSubmit={createForm.handleSubmit(handleSaveTodo)}>
          <Input type="text" {...createForm.register("name")} />
          {/* React Hook Form の useForm() 時に定義したバリデーション失敗時のエラーメッセージ */}
          <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
            createForm.formState.errors.name?.message as unknown as string
          }</span></div>

          <TextField type="text" {...createForm.register("description")} />
          {/* React Hook Form の useForm() 時に定義したバリデーション失敗時のエラーメッセージ */}
          <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
            createForm.formState.errors.description?.message as unknown as string
          }</span></div>

          <Button type="submit" variant="contained" color="primary">作成</Button>
        </form>
        <List style={{ marginTop: "48px" }} component="ul">
          {todos.map((todo) => {

            // 「TODOを更新するフォーム」のスキーマを yup で定義する（ここではTODOの内容のみを編集できるフォームを作る想定でコード書いています）
            const updateFormSchema = object().required().shape({
              name: string().required('name is required'), // TODO名のinputタグのモデル。値は文字列であり、必須バリデーションを要する。
              description: string().required('description is required'), // TODOの説明のinputタグのモデル。値は文字列であり、必須バリデーションを要する。
            });
            const Todo: React.FC = () => {
              const updateForm = useForm({resolver: yupResolver(updateFormSchema)});
              const updateTodo = (args: FieldValues, id: string) => {
                const {name, description} = args as {name: string, description: string};
                axios.patch(`http://localhost:8888/api/rest/tasks/${id}`,
                {
                  name,
                  description
                },
                {
                  headers: { "x-hasura-admin-secret": "secret" }
                })
                .then(response => {
                  setTodos(todos.filter(todo => todo.id !== id));
                  getTodos();
                  console.log("set")
                }).catch(data =>  {
                  console.log(data)
                })
              }
              return <ListItem component="li">
                <Checkbox
                  value="primary"
                  onChange={() => deleteTodo(todo.id as string)}
                />
                <ListItemText>
                  Name:[{todo.name}] Description:[{todo.description}]
                </ListItemText>
                <ListItemSecondaryAction>
                  <form onSubmit={updateForm.handleSubmit(updateTodo(todo.id))}>
                    <div>
                      <Input type="text" {...updateForm.register("name")} />
                      <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
                        updateForm.formState.errors.name?.message as unknown as string
                      }</span></div>

                      <TextField type="text" {...updateForm.register("description")} />
                      <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
                        updateForm.formState.errors.description?.message as unknown as string
                      }</span></div>
                    </div>
                    <Button type="submit">更新</Button>
                  </form>
                </ListItemSecondaryAction>
              </ListItem>;
            }
            return <Todo key={todo.id} />;
          })}
        </List>
      </Container>
    </>
  );
}