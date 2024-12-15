
const caculateOrdersByQuater = (orders, selectedYear) => {
    let totalOrder = 0;
    // let groupedData = [];
    const allQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    // allQuarters.forEach(quarter => {
    //     groupedData.push({ period: quarter, orderRevenue: 0, bookingRevenue: 0 });
    // });
    let groupedData = [ 
        { period: 'Q1', orderRevenue: 0, bookingRevenue: 0 },
        { period: 'Q2', orderRevenue: 0, bookingRevenue: 0 },
        { period: 'Q3', orderRevenue: 0, bookingRevenue: 0 },
        { period: 'Q4', orderRevenue: 0, bookingRevenue: 0 }
    ]

    // Tính doanh thu từ orders theo quý
    orders.forEach(order => {
        const orderDate = dayjs(order.orderDate);
        if (orderDate.year() === selectedYear) {
            const month = orderDate.month();
            let periodKey = '';
            if (month < 3) periodKey = 'Q1';
            else if (month < 6) periodKey = 'Q2';
            else if (month < 9) periodKey = 'Q3';
            else periodKey = 'Q4';

            const orderRevenue = order.totalPrice || 0;
            const existingPeriod = groupedData.find(item => item.period === periodKey);
            if (existingPeriod) {
                existingPeriod.orderRevenue += orderRevenue;
                totalOrder += orderRevenue; // Cộng vào tổng doanh thu sản phẩm
            }
        }
    });
    return totalOrder;

}

const caculateBookingByQuater = ( bookingData, selectedYear) => {
    let totalBooking = 0;
    let groupedData = [];
    const allQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    allQuarters.forEach(quarter => {
        groupedData.push({ period: quarter, orderRevenue: 0, bookingRevenue: 0 });
    });

    bookingData.forEach(booking => {
        const bookingDate = dayjs(booking.bookingDate);
        if (bookingDate.year() === selectedYear) {
            const month = bookingDate.month();
            let periodKey = '';
            if (month < 3) periodKey = 'Q1';
            else if (month < 6) periodKey = 'Q2';
            else if (month < 9) periodKey = 'Q3';
            else periodKey = 'Q4';

            const bookingRevenue = booking.totalPrice || 0;
            const existingPeriod = groupedData.find(item => item.period === periodKey);
            if (existingPeriod) {
                existingPeriod.bookingRevenue += bookingRevenue;
                totalBooking += bookingRevenue; // Cộng vào tổng doanh thu dịch vụ
            }
        }
    });
}

const calculateRevenue = (orders, bookingData, timeRange, selectedYear) => {
    let groupedData = [];
    let totalOrder = 0;
    let totalBooking = 0;

    // Tạo các mốc thời gian (tháng hoặc quý)
    if (timeRange === 'month') {
        const allMonths = Array.from({ length: 12 }, (_, index) => dayjs().set('year', selectedYear).set('month', index).format('YYYY-MM'));
        allMonths.forEach(month => {
            groupedData.push({ period: month, orderRevenue: 0, bookingRevenue: 0 });
        });

        // Tính doanh thu từ orders
        orders.forEach(order => {
            const orderDate = dayjs(order.orderDate);
            if (orderDate.year() === selectedYear) {
                const periodKey = orderDate.format('YYYY-MM');
                const orderRevenue = order.totalPrice || 0;
                const existingPeriod = groupedData.find(item => item.period === periodKey);
                if (existingPeriod) {
                    existingPeriod.orderRevenue += orderRevenue;
                    totalOrder += orderRevenue; // Cộng vào tổng doanh thu sản phẩm
                }
            }
        });

        // Tính doanh thu từ bookingData
        bookingData.forEach(booking => {
            const bookingDate = dayjs(booking.bookingDate);
            if (bookingDate.year() === selectedYear) {
                const periodKey = bookingDate.format('YYYY-MM');
                const bookingRevenue = booking.totalPrice || 0;
                const existingPeriod = groupedData.find(item => item.period === periodKey);
                if (existingPeriod) {
                    existingPeriod.bookingRevenue += bookingRevenue;
                    totalBooking += bookingRevenue; // Cộng vào tổng doanh thu dịch vụ
                }
            }
        });

    } else if (timeRange === 'quarter') {
        const allQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        allQuarters.forEach(quarter => {
            groupedData.push({ period: quarter, orderRevenue: 0, bookingRevenue: 0 });
        });

        // Tính doanh thu từ orders theo quý
        orders.forEach(order => {
            const orderDate = dayjs(order.orderDate);
            if (orderDate.year() === selectedYear) {
                const month = orderDate.month();
                let periodKey = '';
                if (month < 3) periodKey = 'Q1';
                else if (month < 6) periodKey = 'Q2';
                else if (month < 9) periodKey = 'Q3';
                else periodKey = 'Q4';

                const orderRevenue = order.totalPrice || 0;
                const existingPeriod = groupedData.find(item => item.period === periodKey);
                if (existingPeriod) {
                    existingPeriod.orderRevenue += orderRevenue;
                    totalOrder += orderRevenue; // Cộng vào tổng doanh thu sản phẩm
                }
            }
        });

        // Tính doanh thu từ bookingData theo quý
        bookingData.forEach(booking => {
            const bookingDate = dayjs(booking.bookingDate);
            if (bookingDate.year() === selectedYear) {
                const month = bookingDate.month();
                let periodKey = '';
                if (month < 3) periodKey = 'Q1';
                else if (month < 6) periodKey = 'Q2';
                else if (month < 9) periodKey = 'Q3';
                else periodKey = 'Q4';

                const bookingRevenue = booking.totalPrice || 0;
                const existingPeriod = groupedData.find(item => item.period === periodKey);
                if (existingPeriod) {
                    existingPeriod.bookingRevenue += bookingRevenue;
                    totalBooking += bookingRevenue; // Cộng vào tổng doanh thu dịch vụ
                }
            }
        });
    }

    // Đảm bảo không có NaN trong dữ liệu
    groupedData = groupedData.map(item => ({
        ...item,
        orderRevenue: isNaN(item.orderRevenue) ? 0 : item.orderRevenue,
        bookingRevenue: isNaN(item.bookingRevenue) ? 0 : item.bookingRevenue,
    }));

    return { groupedData, totalOrder, totalBooking };
};
