import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 15px;
  margin: 15px 0;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 1.2rem;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #011E3E; 
  color: white;
  border: 2px solid #011E3E;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover {
    background-color: #003366; 
    border-width: 3px; 
  }
`;

const Message = styled.p`
  color: ${props => (props.error ? 'red' : 'green')};
`;

const AddProduct = ({ userId }) => {
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isProductNameValid, setIsProductNameValid] = useState(true);
  const [isProductUrlValid, setIsProductUrlValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setMessage('Utilizator neautentificat');
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (productName.trim() === '') {
      setIsProductNameValid(false);
      valid = false;
    } else {
      setIsProductNameValid(true);
    }

    if (productUrl.trim() === '') {
      setIsProductUrlValid(false);
      valid = false;
    } else {
      setIsProductUrlValid(true);
    }

    if (!valid) {
      setMessage('Vă rugăm să completați toate câmpurile');
      return;
    }

    if (!userId) {
      setMessage('Utilizator neautentificat');
      return;
    }

    try {
      const response = await axios.post('http://ec2-35-173-129-197.compute-1.amazonaws.com:8000/add-product', {
        userId,
        productName,
        productUrl,
      });
      setMessage('Produs adăugat cu succes');
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else if (error.request) {
        setMessage('Nu am primit răspuns de la server.');
      } else {
        setMessage('Eroare: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h2>Adaugă Produs</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nume produs"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={{ borderColor: isProductNameValid ? '#ccc' : 'red' }}
        />
        <Input
          type="text"
          placeholder="URL produs"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          required
          style={{ borderColor: isProductUrlValid ? '#ccc' : 'red' }}
        />
        <Button type="submit">Adaugă</Button>
      </Form>
      {message && <Message error={message !== 'Produs adăugat cu succes'}>{message}</Message>}
    </div>
  );
};

export default AddProduct;
