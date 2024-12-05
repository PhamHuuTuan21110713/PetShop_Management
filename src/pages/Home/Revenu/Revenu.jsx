import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { OrderFetch } from "~/REST_API_Client";
import dayjs from "dayjs";

const Revenu = () => {
  const currentYear = dayjs().year();
  const [orders, setOrders] = useState([]); // Dữ liệu đơn hàng từ API
  const [revenueData, setRevenueData] = useState([]); // Dữ liệu doanh thu theo tháng

  const fetchOrders = async (page = 1, limit = 1000, filters) => {
    try {
      const response = await OrderFetch.getAllOrder(page, limit, filters); // Lấy đơn hàng từ API
      const fetchedOrders = response.data;

      // Lọc chỉ lấy các đơn hàng có status là 'tc' và năm là 2024
      const filteredOrders = fetchedOrders.filter(order => {
        const orderYear = dayjs(order.orderDate).year();
        return order.status === "tc" && orderYear === 2024;
      });

      setOrders(filteredOrders); // Cập nhật danh sách đơn hàng

    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng: ", error);
      window.alert("Lỗi khi lấy đơn hàng: " + error.message);
    }
  };

  const calculateRevenue = (orders) => {
    const revenueByMonth = Array(12).fill(0); // Mảng chứa doanh thu cho 12 tháng

    orders.forEach(order => {
      const orderDate = dayjs(order.orderDate); // Lấy ngày đặt hàng từ chuỗi ISO
      const month = orderDate.month(); // Lấy tháng từ ngày đặt hàng
      const orderRevenue = order.totalPrice || 0; // Lấy doanh thu từ đơn hàng, mặc định là 0 nếu không có giá trị

      // Cộng doanh thu vào tháng tương ứng
      revenueByMonth[month] += orderRevenue;
    });

    return revenueByMonth;
  };

  useEffect(() => {
    // Lấy đơn hàng cho năm 2024
    const filters = {
      status: "tc", 
      year: 2024,    
    };
    fetchOrders(1, 1000, filters);
  }, []); 

  useEffect(() => {
    // Tính toán doanh thu sau khi có dữ liệu đơn hàng
    if (orders.length > 0) {
      const revenue = calculateRevenue(orders);
      setRevenueData(revenue); // Cập nhật dữ liệu doanh thu theo tháng
    }
  }, [orders]); // Cập nhật khi danh sách đơn hàng thay đổi

  return (
    <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px" }}>
          Doanh thu năm 2024
        </Typography>
      </Box>

      <Box sx={{ maxHeight: "390px", overflowY: "auto", padding: "5px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <LineChart
            sx={{
              ".MuiLineElement-root": {
                stroke: "#37a693",
                strokeWidth: 4,
              },
              ".MuiMarkElement-root": {
                stroke: "#000",
                scale: "0.6",
                fill: "#fff",
                strokeWidth: 2,
              },
            }}
            xAxis={[{
              scaleType: "point",
              data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], // Tháng trong năm
            }]}

            yAxis={[{
              domain: [0, 'auto'],
              tickFormatter: (value) => value,
              tickLabel: {
                  fontSize: 12,
                  padding: 10,
              }
          }]}
            
            series={[
              {
                data: revenueData, // Dữ liệu doanh thu của năm 2024
                label: "Doanh Thu (VND)",
              },
            ]}
            width={580}
            height={390}
            margin={{ left: 70, right: 20, top: 10, bottom: 40 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Revenu;
