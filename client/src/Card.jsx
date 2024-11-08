// Card.jsx
import './Card.css';
import React, { useEffect, useState } from 'react';
import { getImageById } from './cardimg.js'; // Import the function to get the image by id
import back from './assets/Cards/000.png';

const Card = ({ cardId }) => {
    const [imagePath, setImagePath] = useState(null); // State to store the front image path

    useEffect(() => {
        const loadImage = async () => {
            const image = await getImageById(cardId); // Dynamically load the front image based on the id
            if (image) {
                setImagePath(image.default); // Set the image path after loading
            }
        };

        loadImage(); // Call the loadImage function when the component mounts or the id changes
    }, [cardId]); // Re-run the effect when the card id changes

    return (
        <div className="card">
            <div className="card-inner usable">
                <div className="card-front">
                    {imagePath ? (
                        <img src={imagePath} alt={`Card ${cardId}`} className="card-img" />
                    ) : (
                        <p>Loading...</p> // Show loading text while the image is being fetched
                    )}
                </div>
                <div className="card-back">
                    <img src={back} alt="Card Back" className="card-img" />
                </div>
            </div>
        </div>
    );
};

export default Card;
