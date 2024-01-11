import { Container, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './index.css';
import { Link } from 'react-router-dom';
function SuccessStatus() {
  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '56px' }}></div>
      <Container>
        <div className="status-success">
          <CheckCircleIcon sx={{ fontSize: '100px', color: 'green' }} />
          <h1 className="Paid">Paid Successful!</h1>
          <span>Click See Order to see order history</span>
          <Link to={'/OrderHistory'}>
            <Button variant="contained">Order History</Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
export default SuccessStatus;
