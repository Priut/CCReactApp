import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 400px;
  background: #f0f0f0;
  padding: 20px;
  border-right: 1px solid #ccc;
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  background: ${props => (props.selected ? '#d0d0d0' : '#fff')};
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: #d0d0d0;
  }
`;

const DetailsPanel = styled.div`
  flex-grow: 1;
  padding: 20px;
  background: #fff;
  margin-left: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const PriceBox = styled.div`
  background: #011E3E;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  margin-top: 10px;
`;

const ProductLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 1.2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #c9302c;
  }
`;

const Dashboard = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://ec2-34-229-153-14.compute-1.amazonaws.com:8000/products/${userId}`);
          setProducts(response.data);
        } catch (error) {
          setError('Eroare la preluarea produselor');
        }
      };

      fetchProducts();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedProduct) {
      const fetchCurrentPrice = async () => {
        try {
          const response = await axios.get(`http://ec2-34-229-153-14.compute-1.amazonaws.com:8000/getpricesforproduct/${selectedProduct.id}`);
          if (response.data.length > 0) {
            const latestPrice = processPrice(response.data[0].price);
            setCurrentPrice(latestPrice);
            setPriceHistory(response.data);
          } else {
            setCurrentPrice('N/A');
            setPriceHistory([]);
          }
        } catch (error) {
          console.error('Eroare la preluarea prețurilor:', error);
        }
      };

      fetchCurrentPrice();
    }
  }, [selectedProduct]);

  const processPrice = (price) => {
    const numericPrice = price.replace(/[^0-9,]/g, '').replace(',', '.');
    return parseFloat(numericPrice);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://ec2-34-229-153-14.compute-1.amazonaws.com:8000/delete-product/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      setSelectedProduct(null);
      setCurrentPrice(null);
      setPriceHistory([]);
    } catch (error) {
      console.error('Eroare la ștergerea produsului:', error);
    }
  };

  const generateChartData = () => {
    const labels = priceHistory.map(item => new Date(item.date_extracted).toLocaleDateString());
    const data = priceHistory.map(item => processPrice(item.price));
    return {
      labels,
      datasets: [
        {
          label: 'Preț în funcție de dată',
          data,
          fill: false,
          backgroundColor: '#007bff',
          borderColor: '#007bff',
        },
      ],
    };
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container>
      <Sidebar>
        <h2>Produsele tale</h2>
        <ProductList>
          {products.map(product => (
            <ProductItem
              key={product.id}
              selected={selectedProduct && selectedProduct.id === product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <p><strong>{product.product_name}</strong></p>
              <DeleteButton onClick={() => handleDeleteProduct(product.id)}>Șterge</DeleteButton>
            </ProductItem>
          ))}
        </ProductList>
      </Sidebar>
      {selectedProduct && (
        <DetailsPanel>
          {currentPrice && (
            <PriceBox>
              Preț curent: {currentPrice} Lei
            </PriceBox>
          )}
          <ProductLink href={selectedProduct.product_url} target="_blank" rel="noopener noreferrer">
            Vizitează produsul
          </ProductLink>
          <ChartContainer>
            <Line data={generateChartData()} />
          </ChartContainer>
        </DetailsPanel>
      )}
    </Container>
  );
};

export default Dashboard;
