import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import myStyle from "~/pages/AccountManager/AllAccount/AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DetailsIcon from '@mui/icons-material/Details';
import { CategoryFetch, ProductFetch } from "~/REST_API_Client"; // Assuming this is your API client for categories
import ProductModal from "~/components/Modal/Product/ProductModal";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const AllProduct = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { categories } = useOutletContext(); 
  //const [categories, setCategories] = useState([]); // Store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category ID
  //const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState("sold");
  const [find, setFind] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minStar: 0,
    maxStar: 5,
    name: "",
    productId: "",
    onlyPromotion: false
  })

  const indexProduct = useRef(0);
  

  const fetchProducts = async (cateValue, page, condition, sorting) => {
    //console.log("Fetching products with categoryId:", cateValue);
    try {
      let data;
      if (!cateValue) {
        data = await ProductFetch.getAllProduct(page, sorting, filters, condition.limit);
        console.log("Products fetched without category:", data);
        setProducts(data.data); // Cập nhật sản phẩm
        setTotalPages(data.data.totalPage);
      } else {
        data = await CategoryFetch.getById(cateValue, condition, filters, sorting);
        console.log("Products fetched with categoryId:", cateValue, data); // In kết quả trả về
        setProducts(data.data); // Cập nhật sản phẩm
        setTotalPages(data.page);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(`Lỗi lấy sản phẩm: \n${error.message}`);
      setIsLoading(false);
    }
  };



  console.log("product nhe ", products.products);



  useEffect(() => {

    const condition = { page: 1, limit: 10 }
    fetchProducts(selectedCategory, 1, condition, sort);



  }, [selectedCategory, filters]);


  const updateStateProduct = async (product, newState, index) => {
    const formData = new FormData();
    formData.append("name", product?.name);
    formData.append("desc", product?.desc);
    formData.append("type", product?.type);
    formData.append("price", product?.price);
    formData.append("state", JSON.parse(newState));
    console.log("update State", formData);

    ProductFetch.updateProduct(product?._id, formData)
      .then(data => {
        try {
          //console.log("Cập nhật thành công:", data);
          const productData = data.data;
          const newData = [...products.products];
          newData[index] = productData;

          // Cập nhật state
          setProducts(prevProducts => {
            console.log("State sản phẩm cũ: ", prevProducts);
            return { ...prevProducts, products: newData };
          });
        } catch (err) {
          console.error("Lỗi khi cập nhật state:", err);
          toast.error(`Lỗi khi cập nhật trạng thái sản phẩm: \n ${err.message}`);
        }
      })
      .catch(err => {
        console.error("Lỗi cập nhật:", err); // In ra lỗi chi tiết
        toast.error(`Lỗi cập nhật dữ liệu sản phẩm: \n ${err.message}`);
      });
  }

  const onChangeProducts = (data) => {
    console.log("data modal: ", data);
    console.log("data products: ", products);

    
    const newProducs = [...products.products];
    newProducs[indexProduct.current] = data;
    // setProducts({products: newProducs});
    setProducts(prevProducts => {
      console.log("State sản phẩm cũ: ", prevProducts);
      return { ...prevProducts, products: newProducs };
    });
}

  const handleOpenModal = (index) => {
    indexProduct.current = index;
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSort = (type) => {
    setSort(type);
    console.log("Kieur loc: ", type);

    const condition = { page: 1, limit: 10 };
    fetchProducts(selectedCategory, 1,condition , type)
  };

  const handleChangeFind = (e) => {
    setFind(e.target.value);  
    
  };


  const handleSearch = () => {
    const searchTerm = find.trim();  
  
      const isProductId = /^[a-fA-F0-9]{24}$/.test(searchTerm);
  
      setFilters(prevFilters => ({
        ...prevFilters,
        productId: isProductId ? searchTerm : "",  
        name: isProductId ? "" : searchTerm  
      }));
  
  };
  

  const handlePageChange = (e, newPage) => {
    console.log("newpage", newPage);

    setPage(newPage); // Cập nhật giá trị page
    const condition = { page: newPage, limit: 10 };
    fetchProducts(selectedCategory, parseInt(newPage), condition, sort);
  };

  const handleCategoryChange = (event) => {
    console.log("Danh mujc test: ", event.target.value);

    setSelectedCategory(event.target.value);
    //setSelectedCategoryName(event.target.value.cateName)

  };
  console.log("Nguoi dc chon", selectedCategory);

  const selectedCategoryName = categories
    .map(category => {
      // Kiểm tra danh mục con có phải là lựa chọn không
      if (category._id === selectedCategory) {
        return category.name;
      }
      // Kiểm tra danh mục con
      const subCategory = category.subCategory?.find(sub => sub._id === selectedCategory);
      return subCategory ? subCategory.name : null;
    })
    .filter(name => name !== null)[0] || "Tất cả";  // Hiển thị tên danh mục hoặc "Tất cả" nếu không có

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          {/* Search Bar */}
          <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
            <input className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" value={find} onChange={handleChangeFind} />
            <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
          </Box>
        </Box>

        {/* Sort Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Sắp xếp: </Typography>
          <Button
            onClick={() => handleSort("default")}
            sx={{ textTransform: "none" }}
            variant={sort === "default" ? "contained" : "outlined"}>
            Mặc định
          </Button>
          <Button
            onClick={() => handleSort("sold")}
            sx={{ textTransform: "none" }}
            variant={sort === "sold" ? "contained" : "outlined"}>
            Bán chạy
          </Button>
        </Box>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px" }}>
        <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Bộ lọc: </Typography>
        {/* Dropdown for categories */}
        <FormControl variant="outlined" sx={{ minWidth: 150, position: 'relative' }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Danh mục"
            sx={{ width: '100%' }}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {categories.map((category) => {
              // Tạo mảng các MenuItem cho danh mục cha và danh mục con
              const menuItems = [
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>,
                // Nếu có các danh mục con, hiển thị chúng
                ...(category.subCategory?.map((subCateItem) => (
                  <MenuItem key={subCateItem._id} value={subCateItem._id} sx={{ paddingLeft: 3 }}>
                    {subCateItem.name}
                  </MenuItem>
                )) || []) // Nếu không có subCategory, trả về mảng trống
              ];

              // Trả về mảng các MenuItem
              return menuItems;
            })}
          </Select>
        </FormControl>




      </Box>

      {/* Table */}
      <Box sx={{ marginTop: "20px" }}>
        <Box className={myStyle.tableContainer}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "10%" }}>STT</th>
                <th style={{ width: "24%" }}>Tên sản phẩm</th>
                <th style={{ width: "15%" }}>Danh mục</th>
                <th style={{ width: "10%" }}>Số lượng</th>
                <th style={{ width: "10%" }}>Đã bán</th>
                <th style={{ width: "15%" }}>Trạng thái</th>
                <th style={{ width: "16%" }}>Hành động</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {products?.products?.length > 0 &&
                  products.products.map((product, index) => (
                    // Kiểm tra nếu sản phẩm không có tên hoặc không có trạng thái, không hiển thị dòng này
                    (product.name && product.state !== undefined) && (
                      <tr key={product._id || index}>
                        <td>{index+1}</td>
                        <td>{product.name}</td>
                        <td>{selectedCategoryName}</td>
                        <td>{product.quantity}</td>
                        <td>{product.sold}</td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.state === true ? (
                            product.quantity !== 0 ? (
                              <Chip label="Kinh doanh" color="success" />
                            ) : (
                              <Chip label="Hết hàng" color="warning" />
                            )
                          ) : (
                            <Chip label="Dừng kinh doanh" color="error" />
                          )}
                        </td>

                        <td>
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                            <Tooltip title="Chi tiết">
                              <button
                                onClick={() => handleOpenModal(index)}
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#fff",
                                  background: "#346791",
                                  borderRadius: "4px"
                                }}
                              >
                                <DetailsIcon />
                              </button>
                            </Tooltip>
                            {product.state === true ? (
                              <Tooltip title="Khóa sản phẩm">
                                <button
                                  onClick={() => updateStateProduct(product, false, index)}
                                  style={{
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#fff",
                                    background: "#b55050",
                                    borderRadius: "4px"
                                  }}
                                >
                                  <LockIcon />
                                </button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Mở khóa sản phẩm">
                                <button
                                  onClick={() => updateStateProduct(product, true, index)}
                                  style={{
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#fff",
                                    background: "#50c77f",
                                    borderRadius: "4px"
                                  }}
                                >
                                  <LockOpenIcon />
                                </button>
                              </Tooltip>
                            )}
                          </Box>
                        </td>
                      </tr>
                    )
                  ))}
              </tbody>

            )}
          </table>
        </Box>
      </Box>

      {!isLoading && (
        <>
          <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPages} // Tính số trang dựa trên tổng số sản phẩm
              size="small"
            />
          </Box>
          {/* Modal for product details */}
          <ProductModal open={openModal} onClose={handleCloseModal} product={products?.products[indexProduct.current]} onChange={onChangeProducts}/>
        </>
      )}
      <ToastContainer />
    </Box>
  );
};

export default AllProduct;
