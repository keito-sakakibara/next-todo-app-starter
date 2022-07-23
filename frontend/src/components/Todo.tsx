import {
  Button,
  Checkbox,
  Container,
  ListItem,
  ListItemText
} from '@material-ui/core';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

type Todos = {
  id: string
  name: string
  description: string
};

export const Todo: React.FC<Todos>= (props) => {
  const id = props.id
  const name = props.name
  const description = props.description
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

  return (
    <ListItem component="li">
      <Container style={{ display: "flex"}}>
        <Checkbox
          value="primary"
          onChange={() => deleteTodo(id as string)}
        />
        <ListItemText>
          Name:[{name}] Description:[{description}]
        </ListItemText>
        <Button onClick={() => redirectEdit(id)} variant="contained" color="primary">更新</Button>
      </Container>
    </ListItem>
  );
}