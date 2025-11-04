import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer(){
    return(
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-info">
          <p className="copyright">© 2025 Vincle</p>
          <p className="contact-info">
            <strong>Contato:</strong> <a href="mailto:contato@vincle.com.br">contato@vincle.com.br</a>
          </p>
        </div>
        <Link to="/denuncia" className="denuncia-link">Canal de Denúncia Anônima</Link>
      </div>
    </footer>    

);
}


export default Footer;