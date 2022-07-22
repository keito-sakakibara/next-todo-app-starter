import axios from "axios";
import { useState } from "react";
import {
  Button,
  Input,
  TextField
  } from '@material-ui/core';

import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from "yup";
import { useRouter } from 'next/router'



export default function Edit() {
  const router = useRouter();
  const [todos, setTodos] = useState<{
    id: string;
    name: string;
    description: string;
  }[]>([]);
  const updateFormSchema = object().required().shape({
    name: string().required('名前を入力してください').max(20, '20文字以下で入力してください'),
    description: string().max(20, '20文字以下で入力してください')
  });
  const updateForm = useForm({resolver: yupResolver(updateFormSchema)});
  const updateTodo = (args: FieldValues, id: string) => {
    const {name, description} = args as {name: string, description: string};
    axios.put(`http://localhost:8888/api/rest/tasks/${id}`,
    {
      name,
      description
    },
    {
      headers: { "x-hasura-admin-secret": "secret" }
    })
    .then(response => {
      setTodos(todos.filter(todo => todo.id !== id));
    }).catch(data =>  {
      console.log(data)
    })
    backHome()
  }
  const backHome = () => {
    router.push('/')
  }



  return (
    <>
      <form onSubmit={updateForm.handleSubmit(data => {
        updateTodo(data,(router.query.id) as string);
      })}>
        <Input type="text" {...updateForm.register("name")} />
        <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
          updateForm.formState.errors.name?.message as unknown as string
        }</span></div>

        <TextField type="text" {...updateForm.register("description")} />
        <div style={{marginBottom: 10}}><span style={{color: 'red'}}>{
          updateForm.formState.errors.description?.message as unknown as string
        }</span></div>
        <Button type="submit">更新</Button>
      </form>
      <a onClick={backHome}>戻る</a>
    </>
  );
}