import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import SearchBox from "../component/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import NewItemDialog from "../component/NewItemDialog";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductTable from "../component/ProductTable";

const AdminProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    products: productList,
    totalPageNum,
    loading,
    error,
  } = useSelector((state) => state.product);

  const [query, setQuery] = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  useEffect(() => {
    dispatch(productActions.getProductList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  const deleteItem = (id) => {
    // 아이템 삭제하기
  };

  const openEditForm = (product) => {
    // edit 모드로 설정하고
    // 아이템 수정 다이얼로그 열어주기
  };

  const handleClickNewItem = () => {
    setMode("new");
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    // 쿼리에 페이지 값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <ProductTable
            header={tableHeader}
            data={productList || []} // productList가 undefined인 경우 빈 배열을 전달
            deleteItem={deleteItem}
            openEditForm={openEditForm}
          />
        )}
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1} // 1페이지면 2임 여긴 한개씩 +1 해야함
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default AdminProduct;
