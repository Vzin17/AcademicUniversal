import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer(){
    return(

    <footer>
        <div className="Rodape">
            <h1 className='Copy'>© 2025 InterSocial</h1>
        </div>
            
        <div className='Contato'>
            <Link to = '/contato' className='contato'> Contato </Link>
            
        </div>

        <div className='denuncia'>
            <Link to ='/denuncia' className='denuncia'> Denúncia anônima </Link>
        </div>


        
    </footer>

);
}


export default Footer;