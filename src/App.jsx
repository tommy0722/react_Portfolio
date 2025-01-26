import React from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import MyCard from './components/myCard';


function App() {
	const cardsData = [
		{
			title: "Card 1",
			text: "This is the first card.",
			image: "https://via.placeholder.com/150",
			link: "https://example.com/card1",
			buttonText: "Learn More",
		},
		{
			title: "Card 2",
			text: "This is the second card.",
			image: "https://via.placeholder.com/150",
			link: "https://example.com/card2",
			buttonText: "Discover",
		},
		{
			title: "Card 3",
			text: "This is the third card.",
			image: "https://via.placeholder.com/150",
			link: "https://example.com/card3",
			buttonText: "Explore",
		},
	];
	return (
		<>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
				{cardsData.map((card, index) => (
					<MyCard key={index} data={card} />
				))}
			</div>
		</>
	);
}

export default App;
