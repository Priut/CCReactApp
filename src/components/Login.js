import React, { useState } from 'react';
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

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://ec2-3-91-191-18.compute-1.amazonaws.com:8000/login', {
        username,
        password,
      });
      if (response.data.message === 'Autentificare cu succes') {
        const userId = response.data.user_id;
        onLoginSuccess(userId);
        navigate('/dashboard');
      } else {
        setMessage(response.data);
      }
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
      <h2>Autentificare</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nume de utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Autentificare</Button>
      </Form>
      {message && <Message error={message !== 'Autentificare cu succes'}>{message}</Message>}
    </div>
  );
};

export default Login;
