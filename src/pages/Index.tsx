import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động chuyển đến trang Admin
    navigate('/admin');
  }, [navigate]);

  return null;
};

export default Index;
