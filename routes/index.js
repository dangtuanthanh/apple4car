var express = require('express');
const cors = require('cors');//lỗi CORS
var router = express.Router();
const sql = require("../dboperation");//load file dboperation
const bodyParser = require('body-parser');//phương thức POST

router.use(cors());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'APPLE4CAR' });
});

//Lấy dữ liệu xe
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
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql.dangKy(data).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
      res.status(500).json({ error: 'Lỗi khi đăng ký: ', error });
  });
});

module.exports = router;
