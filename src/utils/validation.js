import * as Yup from 'yup';

// Tạo Yup validation schema cho form
const validationSchema = Yup.object({
  name: Yup.string().required('Tên sản phẩm là bắt buộc'),
  desc: Yup.string().required('Mô tả sản phẩm là bắt buộc'),
  type: Yup.string().required('Danh mục sản phẩm là bắt buộc'),
  price: Yup.number()
    .required('Giá sản phẩm là bắt buộc')
    .positive('Giá sản phẩm phải là số dương')
    .min(1, 'Giá phải lớn hơn 0'),
  quantity: Yup.number()
    .required('Số lượng sản phẩm là bắt buộc')
    .positive('Số lượng sản phẩm phải là số dương')
    .min(1, 'Số lượng phải lớn hơn 0'),
  sold: Yup.number()
    .min(0, 'Số lượng đã bán phải là số dương hoặc bằng 0')
    .nullable(),
});

export default validationSchema;
