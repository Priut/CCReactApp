import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const Products = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://ec2-35-173-129-197.compute-1.amazonaws.com:8000/products/${userId}`);
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
          const response = await axios.get(`http://ec2-35-173-129-197.compute-1.amazonaws.com:8000/getpricesforproduct/${selectedProduct.id}`);
          if (response.data.length > 0) {
            setCurrentPrice(response.data[0].price);
          } else {
            setCurrentPrice('N/A'); 
          }
        } catch (error) {
          console.error('Eroare la preluarea prețurilor:', error);
        }
      };

      fetchCurrentPrice();
    }
  }, [selectedProduct]);

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
            </ProductItem>
          ))}
        </ProductList>
      </Sidebar>
      {selectedProduct && (
        <DetailsPanel>
          {currentPrice && (
            <PriceBox>
              Preț curent: {currentPrice}
            </PriceBox>
          )}
          <ProductLink href={selectedProduct.product_url} target="_blank" rel="noopener noreferrer">
            Vizitează produsul
          </ProductLink>
        </DetailsPanel>
      )}
    </Container>
  );
};

export default Products;
