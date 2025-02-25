import Card from "react-bootstrap/Card";

export const coachCard = (user) => {
  return (
    <Card className="mb-3" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{user.first_name + " " + user.last_name}</Card.Title>
        <Card.Text>{user.title}</Card.Text>
        <Card.Text>{user.introduction}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export const studentCard = (user) => {
  return (
    <Card className="mb-3" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{user.first_name + " " + user.last_name}</Card.Title>
        <Card.Text>{user.title}</Card.Text>
        <Card.Text>{user.introduction}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const UserCard = ({ user, type }) => {
  return <>{type == "coach" ? coachCard(user) : studentCard(user)}</>;
};

export default UserCard;
