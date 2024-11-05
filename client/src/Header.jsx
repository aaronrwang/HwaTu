import './Header.css';
import { FaInfo } from 'react-icons/fa';
export default function Header({ page }) {

    return (<>
        <div className='header'><p>{page}</p><FaInfo className="directions-button" size="18px" onClick={() => console.log('directions')} /></div>
    </>);
}