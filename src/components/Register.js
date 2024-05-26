import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://ec2-34-229-153-14.compute-1.amazonaws.com:8000/register', {
        email,
        username,
        password,
      });
      setMessage(response.data);
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
      <h2>Înregistrare</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <Button type="submit">Înregistrează-te</Button>
      </Form>
      {message && <Message error={message !== 'Înregistrare cu succes'}>{message}</Message>}
    </div>
  );
};

export default Register;
