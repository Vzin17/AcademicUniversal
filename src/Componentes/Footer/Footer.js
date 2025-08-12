import './Footer.css';
import { Link } from 'react-router-dom';
function Footer(){
    return(
    <footer>
        <div className="Rodape">
            <h1 className='Copy'>© 2025 InterSocial</h1>
        </div>
        
        <div className='denuncia'>
            <Link to ='/denuncia' className='denuncia'> Denúncia anonima </Link>
        </div>
        
    </footer>

);
}


export default Footer;