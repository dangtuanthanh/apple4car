var express = require("express");
const cors = require("cors"); //xử lý chính sách CORS
var router = express.Router();
const sql = require("../dboperation"); //load file dboperation
const bodyParser = require("body-parser"); //phương thức POST
//const bcrypt = require("bcrypt"); //dùng để tạo phiên đăng nhập
const multer = require('multer');//xử lý lưu ảnh
const path = require('path');//xử lý thêm phần mở rộng cho ảnh

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "APPLE4CAR" });
});

//Lấy dữ liệu user
router.get("/layuser", function (req, res, next) {
  sql.layuser().then((result) => {
    res.json(result);
  });
});
//todo Lấy dữ liệu xe

router.get("/layxe", function (req, res, next) {
  sql.layxe().then((result) => {
    res.json(result);
  });
});
//Đăng ký hệ thống
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post("/dangky", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  console.log(req.body);
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .dangKy(data)
    .then((result) => {
      //return { success: true, message: 'Đăng nhập thành công!' };
      res.status(200).json({ success: true, message: "Đăng ký thành công!" });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Lỗi đăng ký", error });
    });
});

//đăng nhập

router.post("/dangnhap", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .dangNhap(data, res)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập:  ", error });
    });
});

//kiểm tra phiên làm việc:
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post("/sessionID", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .SessionID(data)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập:  ", error });
    });
});

//*quản lý xe

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//! Thêm thông tin xe
router.post("/themxe", function (req, res, next) {
  const { MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh } = req.body;
  sql
    .themxe(MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Thêm thông tin xe thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi thêm thông tin xe", error });
    });
});
//* Sửa thông tin xe
router.put("/suaxe/:MaXe", function (req, res, next) {
  const MaXe = parseInt(req.params.MaXe);

  const { TenXe, MaLoaiXe, BienSo, GhiChu, Anh } = req.body;

  sql
    .suaxe(MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Sửa thông tin xe thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi sửa thông tin xe", error });
    });
});

//? Xóa thông tin xe
router.delete("/xoaxe/:MaXe", function (req, res, next) {
  const MaXe = parseInt(req.params.MaXe);
  sql
    .xoaxe(MaXe)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Xóa thông tin xe thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi xóa thông tin xe", error });
    });
});

// Upload ảnh xe
router.use(express.static(path.join(__dirname, 'public')));//thiết lập cho phép truy cập file static
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploadAnhXe/'); // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
    cb(null, file.fieldname + '-' + Date.now() + ext); // Đổi tên file và thêm phần mở rộng
  }
});

const newupload = multer({ storage: storage });
router.post('/uploadAnhXe/:MaXe', newupload.single('image'), (req, res) => {
  const MaXe = req.params.MaXe;
  const imagePath = req.file.path;
  //const domain = 'http://localhost:3000';
  const domain = 'http://' + req.hostname + ':' + req.app.get('port');
  const newPath = path.relative('public', imagePath);
  const imagePathWithDomain = path.join(domain,newPath);

  sql
    .themSuaAnhXe(MaXe,imagePathWithDomain)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Cập nhật ảnh xe thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi khi Cập nhật ảnh xe", error });
    });
  
});
module.exports = router;
