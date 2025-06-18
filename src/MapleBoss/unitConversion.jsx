import React, { useState } from 'react';
import { Container, Form, Table } from 'react-bootstrap';

function UnitConversion() {
    const [snowflakes, setSnowflakes] = useState(0);
    const [snowToMaple, setsnowToMaple] = useState(0);
    const [WCToMaple, setWCToMaple] = useState(0);

    const snowToTWD = 45 / 11;         // ≈ 4.09
    const snowToWC = 300 / 11;         // ≈ 27.27
    // const snowToMaple2 = (300 * snowToMaple) / 11;  // 每 WC = 1000 楓幣

    const handleChange_Snowflakes = (e) => {
        setSnowflakes(parseFloat(e.target.value) || 0);
    };
    const handleChange_SnowToMaple = (e) => {
        setsnowToMaple(parseFloat(e.target.value) || 0);
    };
    const handleChange_WCToMaple = (e) => {
        setWCToMaple(parseFloat(e.target.value) || 0);
    };
    function snowToTWDFunc(snowflakes) {
        return (snowflakes * snowToTWD).toFixed(0);
    }
    function snowToMapleFunc(snowflakes) {
        return (snowflakes * snowToMaple).toFixed(0);
    }
    function snowToWCFunc(snowflakes) {
        return (snowflakes * snowToWC).toFixed(0);
    }
    function WCToMapleFunc(WCToMaple,snowToWC,snowToMaple) {
        return ((snowToMaple / snowToWC)*WCToMaple).toFixed(0);
    }

    return (
        <div className="maple-boss-container">
            <Container className="mt-4 text-center">
                <h2>💱 貨幣換算工具</h2>
                <Form.Label>請輸入「1 雪花 = 幾楓幣」</Form.Label>
                <Form.Group>
                    <Form.Control
                        type="number"
                        min="0"
                        step="1"
                        value={snowToMaple}
                        onChange={handleChange_SnowToMaple}
                    />
                </Form.Group>

                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>新台幣</th>
                            <th>WC</th>
                            <th>雪花</th>
                            <th>楓幣</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{snowToTWDFunc(snowflakes)} </td>
                            <td>{snowToWCFunc(snowflakes)} </td>
                            <td>
                                <Form.Group>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={snowflakes}
                                        onChange={handleChange_Snowflakes}
                                    />
                                </Form.Group>
                            </td>
                            <td>{snowToMapleFunc(snowflakes)} </td>
                        </tr>

                    </tbody>
                </Table>
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>WC</th>
                            <th>楓幣</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Form.Group>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={WCToMaple}
                                        onChange={handleChange_WCToMaple}
                                    />
                                </Form.Group>
                            </td>
                            <td>{WCToMapleFunc(WCToMaple,snowToWC,snowToMaple)} </td>
                        </tr>

                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default UnitConversion;
