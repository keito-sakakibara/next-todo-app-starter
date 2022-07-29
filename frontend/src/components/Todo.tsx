import {
  Button,
  Checkbox,
  Container,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { useRouter } from 'next/router'

type Todos = {
  id: string
  name: string
  description: string
  deleteTodo: (id: string) => void
};

export const Todo: React.FC<Todos>= (props) => {
  const id = props.id
  const name = props.name
  const description = props.description

  const router = useRouter();
  const redirectEdit = (id:string) => {
    router.push({
        pathname: "/edit",
        query: { id: id },
    });
  };

  return (
    <ListItem component="li">
      <Container style={{ display: "flex"}}>
        <Checkbox
          value="primary"
          onChange={() => props.deleteTodo(id as string)}
        />
        <ListItemText>
          Name:[{name}] Description:[{description}]
        </ListItemText>
        <Button onClick={() => redirectEdit(id)} variant="contained" color="primary">更新</Button>
      </Container>
    </ListItem>
  );
}