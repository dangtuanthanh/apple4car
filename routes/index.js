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

//todo Xuất thông tin xe theo id mã xe
//todo Xuất thông tin xe theo id mã xe
router.get("/getxe/:maxe", function (req, res, next) {
  const maxe = req.params.maxe; // Lấy id contact từ tham số đường dẫn

  sql
    .getxe(maxe)
    .then((result) => {
      if (result.length > 0) {
        res.json(result[0]); // Chỉ xuất ra dữ liệu của phần tử đầu tiên trong kết quả
      } else {
        res
          .status(404)
          .json({ error: "Không tìm thấy thông tin liên hệ với id " + maxe });
      }
    })
    .catch((error) => {
      console.log("Lỗi Tải Dữ Liệu Contact: " + error);
      res.status(500).json({ error: "Lỗi Tải Dữ Liệu Contact" });
    });
});
//todo : lấy user theo idusers
router.get("/getuser/:IDUsers", function (req, res, next) {
  const IDUsers = req.params.IDUsers; // Lấy id contact từ tham số đường dẫn

  sql
    .getuser(IDUsers)
    .then((result) => {
      if (result.length > 0) {
        res.json(result[0]); // Chỉ xuất ra dữ liệu của phần tử đầu tiên trong kết quả
      } else {
        res
          .status(404)
          .json({ error: "Không tìm thấy thông tin liên hệ với id " + IDUsers });
      }
    })
    .catch((error) => {
      console.log("Lỗi Tải Dữ Liệu Contact: " + error);
      res.status(500).json({ error: "Lỗi Tải Dữ Liệu Contact" });
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
  const domain = 'http://' + req.hostname
  const newPath = path.relative('public', imagePath);
  const imagePathWithDomain = path.join(domain,newPath);

  sql
    .themSuaAnhXe(MaXe,imagePathWithDomain)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Cập nhật thông tin thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi khi Cập nhật thông tin", error });
    });
  
});

//sửa user
router.put("/suauser/:IDUsers", async function (req, res, next) {
  const IDUsers = parseInt(req.params.IDUsers);
  const { HoTen, Quyen, UserName } = req.body;

  try {
    const result = await sql.suaThongTinUser(IDUsers, HoTen, Quyen, UserName);
    res.status(200).json({ success: true, message: "Sửa thông tin user thành công" });
  } catch (error) {
    console.log("Lỗi khi sửa thông tin user: " + error);
    res.status(500).json({ success: false, message: "Lỗi sửa thông tin user", error });
  }
});

//Xoá user
router.delete("/xoauser/:IDUsers", async function (req, res, next) {
  const IDUsers = parseInt(req.params.IDUsers);
  try {
    await sql.xoauser(IDUsers);
    res.status(200).json({ success: true, message: "Xóa thông tin user thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi xóa thông tin user", error });
  }
});

//Lấy thông tin người dùng từ form
//Đăng ký hệ thống
router.post("/thongtin", function (req, res, next) {
  console.log(req.body);
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .thongtin(data)
    .then((result) => {
      res.status(200).json({ success: true, message: "Gửi thông tin thành công!" });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Lỗi khi gửi thông tin", error });
    });
});
//todo: lấy dữ liệu thông tin liên hệ 
router.get("/getcontact", function (req, res, next) {
  sql.getcontact().then((result) => {
    res.json(result);
  });
});
//todo Đường dẫn api trả thông tin xe
router.get("/thongtinxe", function (req, res, next) {
  sql.getThongTinXe().then((result) => {
    res.json(result);
  });
});

//todo Xuất thông tin theo id
router.get("/contact/:id", function (req, res, next) {
  const idContact = req.params.id; // Lấy id contact từ tham số đường dẫn

  sql
    .contact(idContact)
    .then((result) => {
      if (result.length > 0) {
        res.json(result[0]); // Chỉ xuất ra dữ liệu của phần tử đầu tiên trong kết quả
      } else {
        res
          .status(404)
          .json({ error: "Không tìm thấy thông tin liên hệ với id " + idContact });
      }
    })
    .catch((error) => {
      console.log("Lỗi Tải Dữ Liệu Contact: " + error);
      res.status(500).json({ error: "Lỗi Tải Dữ Liệu Contact" });
    });
});
//todo: api xử lý giá tự động tăng theo ngày
router.get('/gia/:numberOfDays/:maLoaiXe', async (req, res) => {
  const numberOfDays = parseInt(req.params.numberOfDays);
  const maLoaiXe = parseInt(req.params.maLoaiXe);

  try {
    // Gọi hàm xử lý lấy giá thuê xe
    const gia = await sql.getgia(numberOfDays, maLoaiXe);

    // Định dạng giá thuê là "VND"
    const giaFormatted = gia.toLocaleString('en-US', { style: 'currency', currency: 'VND' });

    // Trả về giá thuê
    res.json({ gia: giaFormatted });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Kiểm tra email cho chức năng quên mật khẩu
router.post("/email", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .CheckEmail(data)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra:  ", error });
    });
});

//Mã xác nhận quên mật khẩu:
router.post("/xacnhanma", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .xacnhanma(data)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra:  ", error });
    });
});
//Thêm bài viết user
router.post("/dangbai", function (req, res, next) {
  // Lấy dữ liệu được gửi đến từ client
  const data = req.body;
  const sessionID = req.headers.ss;
  // Thực hiện thêm dữ liệu vào SQL
  sql
    .dangbai(data,sessionID, res)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi khi thêm bài viết:  ", error });
    });
});

router.get("/laybaiviet", function (req, res, next) {
  sql.laybaiviet().then((result) => {
    res.json(result);
  });
});
// Xóa bài viết từ trang Admin
router.delete("/xoabaiviet/:MaBai", function (req, res, next) {
  const MaBai = parseInt(req.params.MaBai);
  sql
    .xoabaiviet(MaBai)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Xóa thông tin thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi xóa thông tin ", error });
    });
});

//todo : lấy bài viết theo id
router.get("/lay1baiviet/:MaBai", function (req, res, next) {
  const MaBai = req.params.MaBai; // Lấy id contact từ tham số đường dẫn

  sql
    .lay1baiviet(MaBai)
    .then((result) => {
      if (result.length > 0) {
        res.json(result[0]); // Chỉ xuất ra dữ liệu của phần tử đầu tiên trong kết quả
      } else {
        res
          .status(404)
          .json({ error: "Không tìm thấy thông tin với id " + MaBai });
      }
    })
    .catch((error) => {
      console.log("Lỗi Tải Dữ Liệu: " + error);
      res.status(500).json({ error: "Lỗi Tải Dữ Liệu" });
    });
});

//* cập nhật trạng thái duyệt bài viết
router.put("/duyetbai/:MaBai", function (req, res, next) {
  const MaBai = parseInt(req.params.MaBai);

  const TrangThai = req.body.TrangThai;

  sql
    .duyetbai(MaBai,TrangThai)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Sửa thông tin thành công" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Lỗi sửa thông tin", error });
    });
});
//todo: Hiển thị bài viết của người dùng đã đăng nhập
// Route GET '/baiviet' để lấy danh sách bài viết của người dùng đăng nhập
router.get('/laybaivietdaduocduyet', function(req, res, next) {
  const sessionID = req.headers.ss;

  // Kiểm tra sessionID và lấy IDUsers tương ứng
  sql
    .layIDUsersBangSessionID(sessionID)
    .then(result => {
      const IDUsers = result.recordset[0].IDUsers;

      // Lấy danh sách các bài viết của người dùng dựa trên IDUsers
      return sql.layDanhSachBaiViet(IDUsers);
    })
    .then(result => {
      // Trả về danh sách bài viết
      res.status(200).json(result.recordset);
    })
    .catch(error => {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách bài viết', error });
    });
});

//Todo: Xóa, Sửa bài viết theo id user
// Xử lý PUT '/baiviet/:id'
router.put('/baiviet/:id', async (req, res) => {
  try {
    const { sessionID } = req.headers;
    const { id: MaBai } = req.params;
    const { updatedContent } = req.body;

    // Kiểm tra tồn tại bài viết và quyền sở hữu
    const IDUsers = await sql.layIDUsersBangSessionID(sessionID);
    const baiViet = await sql.kiemTraBaiVietCuaNguoiDung(IDUsers, MaBai);

    if (!baiViet) {
      return res.status(404).json({ error: 'Bài viết không tồn tại hoặc không thuộc về bạn' });
    }

    // Cập nhật nội dung bài viết
    await sql.capNhatNoiDungBaiViet(MaBai, updatedContent);

    res.status(200).json({ message: 'Cập nhật nội dung bài viết thành công' });
  } catch (error) {
    console.log('Lỗi khi xử lý yêu cầu PUT: ' + error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
  }
});



router.get('/timkiem/:TenBang/:ColumnName/:Search', function (req, res, next) {
  try {
    const TenBang = req.params.TenBang;
    const columnName = req.params.ColumnName;
    const Search = req.params.Search;
    const encodedSearch = encodeURIComponent(Search); // Mã hóa chuỗi tìm kiếm( mã hoá cả tiếng Việt)

    sql.searchData(TenBang,columnName,encodedSearch ).then((result) => {//gọi hàm searchData
      res.status(200).json(result);
    }).catch((error) => {
      console.log(error);
    });;

  } catch (error) {
    console.log("Error: " + error.message);
    res.sendStatus(500);
  }
});
module.exports = router;


