import './Header.css';
import { FaInfo } from 'react-icons/fa';
import { useState } from 'react';
export default function Header({ page }) {
    const [directions, setDirections] = useState(false);
    let modal = ''
    if (!directions) {
        modal = 'hidden'
    }
    const openDirections = () => setDirections(true);
    const closeDirections = () => setDirections(false);
    return (<>
        <div className='header'><p>{page}</p><FaInfo className="directions-button" size="18px" onClick={openDirections} /></div>
        <div className={`modal ${modal}`}>
            <dialog className="result-modal" open>
                <h2>Hwatu (Go-Stop)</h2>
                <p>These are the directions</p>
                <p>This version is 2 player and stops at 7 points.</p>
                <p><a href="https://en.wikipedia.org/wiki/Go-Stop" target="_blank">Wiki Directions</a></p>
                <button onClick={closeDirections}>Close</button>
            </dialog>
        </div>
    </>);
}