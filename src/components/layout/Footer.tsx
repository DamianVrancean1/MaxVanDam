import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Piese Auto</h3>
          <p>Magazinul tău de piese auto de încredere</p>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@pieseauto.ro</p>
          <p>Telefon: 0700 123 456</p>
        </div>
        
        <div className="footer-section">
          <h4>Program</h4>
          <p>Luni - Vineri: 8:00 - 18:00</p>
          <p>Sâmbătă: 9:00 - 14:00</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Piese Auto. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
};

export default Footer;
