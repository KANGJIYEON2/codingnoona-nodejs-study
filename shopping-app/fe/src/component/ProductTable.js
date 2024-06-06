import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../utils/number";

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  console.log("Data passed to ProductTable:", data);

  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              // Check if any property is an object
              Object.keys(item).forEach((key) => {
                if (
                  typeof item[key] === "object" &&
                  !Array.isArray(item[key])
                ) {
                  console.error(`Property ${key} is an object`, item[key]);
                }
              });

              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{item.sku}</td>
                  <td style={{ minWidth: "100px" }}>{item.name}</td>
                  <td>{currencyFormat(item.price)}</td>
                  <td>
                    {Object.keys(item.stock).map((size, stockIndex) => (
                      <div key={stockIndex}>
                        {size}: {item.stock[size]}
                      </div>
                    ))}
                  </td>
                  <td>
                    <img src={item.image} width={100} alt="product" />
                  </td>
                  <td>{item.status}</td>
                  <td style={{ minWidth: "100px" }}>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      className="mr-1"
                    >
                      -
                    </Button>
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;
