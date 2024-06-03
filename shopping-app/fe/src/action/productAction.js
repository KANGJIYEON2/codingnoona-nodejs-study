import api from "../utils/api";
import * as types from "../constants/product.constants";
import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

const getProductList = (query) => async (dispatch) => {
  try {
    dispatch({ type: types.PRODUCT_GET_REQUEST });
    const response = await api.get("/product");

    // 응답 데이터 구조 확인을 위한 로그
    console.log("API 응답:", response);

    if (response.status !== 200) throw new Error(response.error);

    // 상품 데이터 로그
    console.log("상품 데이터:", response.data.products);

    dispatch({
      type: types.PRODUCT_GET_SUCCESS,
      payload: response.data.products,
    });
  } catch (error) {
    console.error("상품 목록 가져오기 실패:", error);
    dispatch({ type: types.PRODUCT_GET_FAIL, payload: error.message });
  }
};
const getProductDetail = (id) => async (dispatch) => {};

const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: types.PRODUCT_CREATE_REQUEST });
    const response = await api.post("/product", formData);
    if (response.status !== 200) throw new Error(response.error);
    dispatch({ type: types.PRODUCT_CREATE_SUCCESS });
    dispatch(commonUiActions.showToastMessage("상품생성완료!", "success"));
  } catch (error) {
    dispatch({ type: types.PRODUCT_CREATE_FAIL, payload: error.error });
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};
const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};
