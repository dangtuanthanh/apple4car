var express = require('express');
const cors = require('cors');//xử lý chính sách CORS
var router = express.Router();
const sql = require("../dboperation");//load file dboperation
const bodyParser = require('body-parser');//phương thức POST
const bcrypt = require('bcrypt'); //dùng để tạo phiên đăng nhập
const path = require('path');//lấy đường dẫn

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'APPLE4CAR' });
});

//Lấy dữ liệu user
router.get("/layuser", function (req, res, next) {
  sql.layuser().then((result) => {
    res.json(result);
  });
});

//Đăng ký hệ thống 
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post('/dangky', function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  console.log(req.body);
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql.dangKy(data).then((result) => {
    //return { success: true, message: 'Đăng nhập thành công!' };
    res.status(200).json({ success: true, message: 'Đăng ký thành công!' });
  }).catch((error) => {
    res.status(500).json({ success: false, message: 'Lỗi đăng ký', error });
  });
});

//đăng nhập

router.post('/dangnhap', function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql.dangNhap(data,res).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập:  ', error });
  });
});

//kiểm tra phiên làm việc:
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post('/sessionID', function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql.SessionID(data).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập:  ', error });
  });
});

router.get('/anh', (req, res) => {
  // Đường dẫn tới ảnh của bạn
  try {
    const imagePath = path.join(__dirname, 'users.jpg');
    console.log(imagePath);
  // Trả về ảnh cho máy khách
  res.sendFile(imagePath);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
