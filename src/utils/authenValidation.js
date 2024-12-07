import * as yup from 'yup';

// Schema cho đăng nhập
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email không đúng định dạng!'
    )
    .min(6, 'Email có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Email có độ dài từ 6 - 120 ký tự!'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!')
    .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng!')
    .min(6, 'Mật khẩu có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Mật khẩu có độ dài từ 6 - 120 ký tự!'),
});

// Schema cho đăng ký
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên!')
    .matches(/^[a-zA-Z\u00C0-\u1EF9\s'\-,.]+$/u, 'Tên không được chứa ký tự đặc biệt!')
    .max(120, 'Tên có độ dài không vượt quá 120 ký tự!'),
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email không đúng định dạng!'
    )
    .min(6, 'Email có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Email có độ dài từ 6 - 120 ký tự!'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!')
    .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng!')
    .min(6, 'Mật khẩu có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Mật khẩu có độ dài từ 6 - 120 ký tự!'),
  // confirmPassword: yup
  //   .string()
  //   .required('Vui lòng nhập lại mật khẩu!')
  //   .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp!'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại!')
    .matches(/^0\d{9}$/, 'Số điện thoại chứa 10 số và bắt đầu từ 0!')
    .min(10, 'Số điện thoại bao gồm 10 chữ số!')
    .max(10, 'Số điện thoại bao gồm 10 chữ số!'),
  address: yup.string().required('Vui lòng nhập địa chỉ!').max(200, 'Địa chỉ có độ dài không vượt quá 200 ký tự!'),
  avatar: yup
    .mixed()
    .notRequired()
    .test('fileType', 'Ảnh đại diện phải là file .png, .jpg, hoặc .jpeg!', (value) => {
      if (value && value.length > 0) {
        const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        return validFileTypes.includes(value[0].type);
      }
      return true;
    })
    .test('fileSize', 'Ảnh đại diện không quá 2MB!', (value) => {
      if (value && value.length > 0) {
        return value[0].size <= 2 * 1024 * 1024;
      }
      return true;
    }),
});

// Schema cho cập nhật thông tin
export const updateSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên!')
    .matches(/^[a-zA-Z\u00C0-\u1EF9\s'\-,.]+$/u, 'Tên không được chứa ký tự đặc biệt!')
    .max(120, 'Tên có độ dài không vượt quá 120 ký tự!'),
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email không đúng định dạng!'
    )
    .min(6, 'Email có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Email có độ dài từ 6 - 120 ký tự!'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại!')
    .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'Số điện thoại không hợp lệ!')
    .min(10, 'Số điện thoại bao gồm 10 chữ số!')
    .max(10, 'Số điện thoại bao gồm 10 chữ số!'),
  address: yup.string().required('Vui lòng nhập địa chỉ!').max(200, 'Địa chỉ có độ dài không vượt quá 200 ký tự!'),
  avatar: yup
    .mixed()
    .notRequired()
    .test('fileType', 'Ảnh đại diện phải là file .png, .jpg, hoặc .jpeg!', (value) => {
      if (value && value.length > 0) {
        const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        return validFileTypes.includes(value[0].type);
      }
      return true;
    })
    .test('fileSize', 'Ảnh đại diện không quá 2MB!', (value) => {
      if (value && value.length > 0) {
        return value[0].size <= 2 * 1024 * 1024;
      }
      return true;
    }),
});

// Schema cho quên mật khẩu
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email không đúng định dạng!'
    )
    .min(6, 'Email có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Email có độ dài từ 6 - 120 ký tự!'),
});

// Schema cho đặt lại mật khẩu
export const resetPasswordSchema = yup.object().shape({
  key: yup
    .string()
    .required('Vui lòng nhập OTP!')
    .matches(/^\d{6}$/, 'OTP phải bao gồm đúng sáu chữ số!'),
  token: yup.string().required(),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!')
    .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng!')
    .min(6, 'Mật khẩu có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Mật khẩu có độ dài từ 6 - 120 ký tự!'),
  confirm_password: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu!')
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp!'),
});

// Schema cho gửi tin nhắn
export const sendMessageSchema = yup.object().shape({
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email không đúng định dạng!'
    )
    .min(6, 'Email có độ dài từ 6 - 120 ký tự!')
    .max(120, 'Email có độ dài từ 6 - 120 ký tự!'),
  name: yup
    .string()
    .required('Vui lòng nhập tên!')
    .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, 'Tên không được chứa ký tự đặc biệt!')
    .max(120, 'Tên có độ dài không vượt quá 120 ký tự!'),
  message: yup.string().required('Vui lòng nhập tin nhắn!').max(500, 'Tin nhắn có độ dài không vượt quá 500 ký tự!'),
});

