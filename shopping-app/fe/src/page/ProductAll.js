import React, { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { productActions } from "../action/productAction";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ProductAll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    products: productList,
    loading,
    error,
  } = useSelector((state) => state.product);

  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  // 쿼리 파라미터가 변경될 때 searchQuery 업데이트
  useEffect(() => {
    const name = query.get("name") || "";
    const page = query.get("page") || 1;
    console.log(`Query params - name: ${name}, page: ${page}`);
    setSearchQuery({ page, name });
  }, [query]);

  // searchQuery가 변경될 때 제품 목록 가져오기
  useEffect(() => {
    const { page, name } = searchQuery;
    console.log(`Dispatching getProductList with name: ${name}, page: ${page}`);
    dispatch(productActions.getProductList({ page, name }));
  }, [searchQuery, dispatch]);

  // searchQuery가 변경될 때 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    console.log(`Navigating to /products?${queryString}`);
    navigate("?" + queryString);
  }, [searchQuery, navigate]);

  return (
    <Container>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Row>
        {productList &&
          productList.map((product) => (
            <Col key={product._id} md={3} sm={12}>
              <ProductCard product={product} />
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default ProductAll;
