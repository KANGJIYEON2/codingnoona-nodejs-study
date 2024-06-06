import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import { productActions } from "../action/productAction";
import { CATEGORY, STATUS, SIZE } from "../constants/product.constants";
import "../style/adminProduct.style.css";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

const NewItemDialog = ({
  mode,
  showDialog,
  setShowDialog,
  refreshProducts,
}) => {
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const { error } = useSelector((state) => state.product);
  const [formData, setFormData] = useState({ ...InitialFormData });
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (stock.length === 0) return setStockError(true);
    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});

    if (mode === "new") {
      await dispatch(
        productActions.createProduct({ ...formData, stock: totalStock })
      );
      setShowDialog(false);
      refreshProducts(); // 새로고침 없이 리스트 업데이트
    } else {
      await dispatch(
        productActions.editProduct(
          { ...formData, stock: totalStock },
          selectedProduct._id
        )
      );
      setShowDialog(false);
      refreshProducts(); // 새로고침 없이 리스트 업데이트
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const addStock = () => {
    setStock([...stock, ["", ""]]);
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((_, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (event, index) => {
    const newStock = [...stock];
    newStock[index][0] = event.target.value;
    setStock(newStock);
  };

  const handleStockChange = (event, index) => {
    const newStock = [...stock];
    newStock[index][1] = event.target.value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: prevFormData.category.includes(value)
        ? prevFormData.category.filter((item) => item !== value)
        : [...prevFormData.category, value],
    }));
  };

  const uploadImage = (url) => {
    setFormData({ ...formData, image: url });
  };

  useEffect(() => {
    if (showDialog) {
      if (mode === "edit" && selectedProduct) {
        console.log("Editing product:", selectedProduct);
        const productData = { ...selectedProduct };
        delete productData._id;
        setFormData(productData);
        const stockArray = Object.entries(selectedProduct.stock).map(
          ([size, count]) => [size, count]
        );
        setStock(stockArray);
      } else if (mode === "new") {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog, mode, selectedProduct]);

  useEffect(() => {
    console.log("formData:", formData);
    console.log("stock:", stock);
  }, [formData, stock]);

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "Create New Product" : "Edit Product"}
        </Modal.Title>
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="text"
              placeholder="Enter Sku"
              required
              value={formData.sku || ""}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="text"
              placeholder="Name"
              required
              value={formData.name || ""}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description || ""}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) => handleSizeChange(event, index)}
                    required
                    value={item[0] || ""}
                  >
                    <option value="" disabled hidden>
                      Please Choose...
                    </option>
                    {SIZE.map((size, idx) => (
                      <option
                        value={size.toLowerCase()}
                        disabled={stock.some(
                          (s) => s[0] === size.toLowerCase()
                        )}
                        key={idx}
                      >
                        {size}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) => handleStockChange(event, index)}
                    type="number"
                    placeholder="number of stock"
                    value={item[1] || ""}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          {formData.image && (
            <img
              id="uploadedimage"
              src={formData.image}
              className="upload-image mt-2"
              alt="uploadedimage"
            />
          )}
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price || 0}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category || []}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status || "active"}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          {mode === "new" ? "Submit" : "Edit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
