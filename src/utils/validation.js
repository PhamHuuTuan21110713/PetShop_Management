import * as Yup from 'yup';

// Tạo Yup validation schema cho form
const createProductValidation = Yup.object({
  name: Yup.string().required('Tên sản phẩm là bắt buộc'),
  desc: Yup.string().required('Mô tả sản phẩm là bắt buộc'),
  type: Yup.string().required('Loại sản phẩm là bắt buộc'),
  price: Yup.number()
    .required('Giá sản phẩm là bắt buộc') 
    .min(1, 'Giá phải lớn hơn 0')  
    .typeError('Giá phải là một số hợp lệ')
    .integer("Giá phải là số nguyên"),

  quantity: Yup.number()
    .required('Số lượng sản phẩm là bắt buộc')
    .integer('Số lượng phải là số nguyên')
    .typeError('Số lượng phải là một số hợp lệ')
    .min(1, 'Số lượng phải lớn hơn 0'),
  sold: Yup.number()
    .min(0, 'Số lượng đã bán phải là số dương hoặc bằng 0')
    .nullable(),
  categoryId: Yup.string().required('Danh mục sản phẩm là bắt buộc')
});

const updateProductValidation = Yup.object({
  name: Yup.string().required('Tên sản phẩm là bắt buộc'),
  desc: Yup.string().required('Mô tả sản phẩm là bắt buộc'),
  type: Yup.string().required('Loại sản phẩm là bắt buộc'),
  price: Yup.number()
    .required('Giá sản phẩm là bắt buộc')
    .min(1, 'Giá phải lớn hơn 0')
    .typeError('Giá phải là một số hợp lệ')
    .integer("Giá phải là số nguyên"),
  quantity: Yup.number()
    .required('Số lượng sản phẩm là bắt buộc')
    .integer('Số lượng phải là số nguyên')
    .typeError('Số lượng phải là một số hợp lệ')
    .min(1, 'Số lượng phải lớn hơn 0'),
});

const createPromotionValidation = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên chương trình!'),
  desc: Yup.string().required('Vui lòng nhập mô tả!'),
  value: Yup.number()
    .required('Vui lòng nhập giá khuyến mãi!')
    .min(1, 'Giá phải lớn hơn 0')
    .integer("Giá phải là số nguyên!"),
  startDate: Yup.string()
    .required('Vui lòng nhập ngày bắt đầu!')
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Ngày bắt đầu không đúng định dạng mm/dd/yyyy!'),
    endDate: Yup.string()
    .required('Vui lòng nhập ngày kết thúc!')
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Ngày kết thúc không đúng định dạng mm/dd/yyyy!')
    .test('is-after-start-date', 'Ngày kết thúc phải lớn hơn ngày bắt đầu!', function (value) {
      const { startDate } = this.parent;  // Lấy giá trị startDate từ parent (schema cùng cấp)
  
      // Nếu không có ngày bắt đầu hoặc kết thúc thì không cần kiểm tra
      if (!startDate || !value) return true;
  
      // Tách các phần của ngày bắt đầu và ngày kết thúc (yyyy/mm/dd)
      const [startMonth, startDay, startYear] = startDate.split('/').map(Number);
      const [endMonth, endDay, endYear] = value.split('/').map(Number);
  
      // So sánh từng phần (năm, tháng, ngày)
      if (endYear < startYear) return false; 
      if (endYear === startYear && endMonth < startMonth) return false; 
      if (endYear === startYear && endMonth === startMonth && endDay <= startDay) return false; 
  
      return true;
  }),
  applicableProducts: Yup.array()
    .of(
        Yup.string()
            .matches(/^[a-fA-F0-9]{24}$/, 'ID sản phẩm phải là chuỗi 24 ký tự hex!')
    )
    .min(1, 'Vui lòng nhập ít nhất một sản phẩm!')
    .required('Vui lòng nhập danh sách sản phẩm áp dụng!')
});


export {
  createProductValidation,
  updateProductValidation,
  createPromotionValidation
};
