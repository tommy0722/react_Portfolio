import React, { useState } from 'react';
import { Container, Form, Table } from 'react-bootstrap';

function UnitConversion() {
    const [snowflakes, setSnowflakes] = useState(0);
    const [snowToMaple, setSnowToMaple] = useState(0);
    const [WCToMaple, setWCToMaple] = useState(0);

    const snowToTWD = 45 / 11; // ≈ 4.09
    const snowToWC = 300 / 11; // ≈ 27.27

    const handleNumberChange = setter => e =>
        setter(parseFloat(e.target.value) || 0);

    const twdAmount = (snowflakes * snowToTWD).toFixed(0);
    const wcAmount = (snowflakes * snowToWC).toFixed(0);
    const mapleAmount = (snowflakes * snowToMaple).toFixed(0);
    const wcToMapleAmount = ((snowToMaple / snowToWC) * WCToMaple).toFixed(0);

    return (
        <div className="maple-boss-container">
            <Container className="mt-4 text-center">
                <h2>💱 貨幣換算工具</h2>

                <Form.Label className="mt-3">請輸入「1 雪花 = 幾楓幣」</Form.Label>
                <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={snowToMaple}
                    onChange={handleNumberChange(setSnowToMaple)}
                    className="mb-4"
                />

                <table className="table-primary table-bordered table-sm text-center" style={{ color: 'white' }}>
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
                            <td>{twdAmount}</td>
                            <td>{wcAmount}</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={snowflakes}
                                    onChange={handleNumberChange(setSnowflakes)}
                                />
                            </td>
                            <td>{mapleAmount}</td>
                        </tr>
                    </tbody>
                </table>

                <table className="table-primary table-bordered table-sm text-center" style={{ color: 'white' }}>
                    <thead>
                        <tr>
                            <th>WC</th>
                            <th>楓幣</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={WCToMaple}
                                    onChange={handleNumberChange(setWCToMaple)}
                                />
                            </td>
                            <td>{wcToMapleAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </Container>
        </div>
    );
}

export default UnitConversion;
