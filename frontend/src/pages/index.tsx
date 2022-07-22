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
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from "yup";
import { useRouter } from 'next/router'

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

  const router = useRouter();
  const redirectEdit = (id:string) => {
    router.push({
        pathname: "/edit",
        query: { id: id },
    });
};

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
        <List style={{ marginTop: "48px" }} component="ul">
          {todos.map((todo) => {
            // 「TODOを更新するフォーム」のスキーマを yup で定義する（ここではTODOの内容のみを編集できるフォームを作る想定でコード書いています）
            const updateFormSchema = object().required().shape({
              name: string().required('名前を入力してください').max(20, '20文字以下で入力してください'),
              description: string().max(20, '20文字以下で入力してください')
            });
            const Todo: React.FC = () => {
              return <ListItem component="li">
                <Container style={{ display: "flex"}}>
                  <Checkbox
                    value="primary"
                    onChange={() => deleteTodo(todo.id as string)}
                  />
                  <ListItemText>
                    Name:[{todo.name}] Description:[{todo.description}]
                  </ListItemText>
                  <a onClick={() => redirectEdit(todo.id)}>更新</a>
                </Container>
              </ListItem>;
            }
            return <Todo key={todo.id} />;
          })}
        </List>
      </Container>
    </>
  );
}