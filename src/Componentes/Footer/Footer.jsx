import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Este import está correto

function Footer() {
  return (
    // A tag <footer> já está a ser estilizada pelo teu CSS
    <footer>
      
      <div className="footer-content">
        
        
        <div className="footer-info">
        
          <p className='copyright'>© 2025 Vincle</p>
          
         
          <p className='contact-info'>
         
            <Link to='/contato'>Contato</Link>
          </p>
        </div>

      
        <Link to='/denuncia' className='denuncia-link'> Denúncia anônima </Link>

      </div>
    </footer>
  );
}

export default Footer;