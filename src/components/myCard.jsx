import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MyCard({ data }) {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src={data.image || "https://via.placeholder.com/150"} />
            <Card.Body>
                <Card.Title>{data.title || "Default Title"}</Card.Title>
                <Card.Text>
                    {data.text || "Default text to build on the card title and make up the bulk of the card's content."}
                </Card.Text>
                <Button variant="primary" href={data.link || "#"}>
                    {data.buttonText || "Go somewhere"}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default MyCard;