var config = require("./dbconfig"); //require() dùng để tải file hoặc gói
const sql = require("mssql"); //tải module mssql
const bcrypt = require("bcrypt"); // dùng để mã hoá mật khẩu
const nodemailer = require('nodemailer');//dùng để gửi email
require('dotenv').config(); // đọc biến môi trường


// Tạo một pool kết nối
const pool = new sql.ConnectionPool(config);
// Kết nối đến cơ sở dữ liệu
async function connectToDatabase() {
  try {
    await pool.connect();
    console.log("Đã kết nối tới cơ sở dữ liệu");
  } catch (error) {
    console.log("Lỗi kết nối cơ sở dữ liệu: " + error);
  }
}

// Khi ứng dụng bắt đầu, kết nối tới cơ sở dữ liệu
connectToDatabase();
//xử lý tải dữ liệu xe
async function layuser() {
  try {
    
    let res = await pool.request().query("SELECT * FROM users");
    return res.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu User :" + error);
  }
}

// Hàm đăng ký
async function dangKy(data) {
  try {
    
    // Mã hóa mật khẩu
    //const hashedPassword = hashPassword(data.Pass);
    const hashedPassword = await bcrypt.hash(data.Pass, 10);
    let res = await pool
      .request()
      .input("HoTen", sql.NVarChar, data.HoTen)
      .input("UserName", sql.VarChar, data.UserName)
      .input("Pass", sql.NVarChar, hashedPassword) // Truyền mật khẩu đã được mã hóa
      .execute("dangky");
    return res.recordsets;
  } catch (error) {
    console.log("Lỗi khi đăng ký: " + error);
  }
}

// Hàm đăng nhập
async function dangNhap(data, res) {
  try {
    
    let result = await pool
      .request()
      .query("SELECT * FROM users WHERE UserName = '" + data.UserName + "'");

    if (result !== undefined && result.recordset.length > 0) {
      let matchedUser;
      for (const user of result.recordset) {
        const isPasswordMatch = await bcrypt.compare(data.Pass, user.Pass);
        if (isPasswordMatch) {
          matchedUser = user;
          break;
        }
      }
      if (matchedUser) {
        console.log("matchedUser: ", matchedUser);
        const userID = matchedUser.IDUsers; // Lấy ID từ người dùng khớp
        // Đăng nhập thành công
        const currentTime = Date.now().toString();
        const secret = "apple4car"; // Thay đổi chuỗi bí mật thành giá trị thực tế
        const sessionID = bcrypt.hashSync(currentTime + secret, 10);
        //thêm 3 ngày thời hạn
        const currentTime2 = Date.now();
        const threeDaysLater = new Date(currentTime2 + (3 * 24 * 60 * 60 * 1000));
        await pool.query`UPDATE users SET SessionID = ${sessionID}, TimeSession = ${threeDaysLater} WHERE IDUsers = ${userID}`;
        console.log(matchedUser.Quyen);
        //res.cookie('ss', sessionID, { maxAge: 3600000, httpOnly: true });
        //res.cookie('ss2', 'aaaa', { maxAge: oneDay, httpOnly: true, secure: false });
        return {
          success: true,
          message: "Đăng nhập thành công!",
          cookieValue: sessionID,
          quyen: matchedUser.Quyen
        };
      } else {
        // Mật khẩu không khớp
        return {
          success: false,
          message: "Tài khoản hoặc mật khẩu không chính xác!",
        };
      }
    } else {
      // Người dùng không tồn tại
      return {
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      };
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi trong quá trình đăng nhập: ", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình đăng nhập!",
    };
  }
}

//hàm lấy thông tin từ sessionID
async function SessionID(sessionID) {
  try {
    
    let result = await pool
      .request()
      .input("SessionID", sql.NVarChar, sessionID.sessionID)
      .query(
        "SELECT IDUsers, HoTen, UserName, Quyen, TimeSession FROM users WHERE SessionID = @SessionID"
      );

    if (result.recordset.length === 0) {
      return { success: false, message: "Bạn hãy đăng nhập lại!" };
    }

    const timeSession = result.recordset[0].TimeSession;
    const currentTime = new Date();

    if (currentTime > timeSession) {
      return { success: false, message: "Bạn hãy đăng nhập lại!" };
    }

    return result.recordset;
  } catch (error) {
    console.log("Lỗi khi kiểm tra SessionID: " + error);
  }
}

//todo: lấy thông tin xe
async function layxe() {
  try {
    
    let result = await pool.request().query("SELECT * FROM xe");
    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Xe: " + error);
  }
}

//todo: Thêm thông tin xe
async function themxe(MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh) {
  try {
    
    let result = await pool
      .request()
      .input("MaXe", sql.Int, MaXe)
      .input("TenXe", sql.NVarChar, TenXe)
      .input("MaLoaiXe", sql.Int, MaLoaiXe)
      .input("BienSo", sql.VarChar, BienSo)
      .input("GhiChu", sql.NVarChar, GhiChu)
      .input("Anh", sql.NVarChar, Anh)
      .execute("themxe");
    return result.recordsets;
  } catch (error) {
    console.log("Lỗi khi thêm thông tin xe: " + error);
  }
}
//todo: sửa thông tin xe
async function suaxe(MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh) {
  try {
    
    let result = await pool
      .request()
      .input("MaXe", sql.Int, MaXe)
      .input("TenXe", sql.NVarChar, TenXe)
      .input("MaLoaiXe", sql.Int, MaLoaiXe)
      .input("BienSo", sql.VarChar, BienSo)
      .input("GhiChu", sql.NVarChar, GhiChu)
      .input("Anh", sql.NVarChar, Anh)
      .execute("suaxe");
    return result.recordsets;
  } catch (error) {
    console.log("Lỗi khi sửa thông tin xe: " + error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi sửa thông tin xe", error });
  }
}
//todo: Xóa thông tin xe
async function xoaxe(MaXe) {
  try {
    
    let result = await pool
      .request()
      .input("MaXe", sql.Int, MaXe)
      .execute("xoaxe");
    return result;
  } catch (error) {
    console.log("Lỗi khi xóa thông tin xe: " + error);
    throw error;
  }
}

//hàm thêm, sửa ảnh xe
async function themSuaAnhXe(MaXe, DuongDanAnh) {
  try {
    
    let result = await pool
      .request()
      .input("MaXe", sql.Int, MaXe)
      .input("Anh", sql.VarChar, DuongDanAnh)
      .query(
        "UPDATE XE SET Anh = @Anh WHERE MaXe = @MaXe"
      );
    return result;
  } catch (error) {
    console.log("Lỗi khi thêm ảnh xe: " + error);
    throw error;
  }
}

//hàm xoá user
async function xoauser(IDUsers) {
  try {
    
    let result = await pool
      .request()
      .input("IDUsers", sql.Int, IDUsers)
      .query("DELETE FROM BaiDang WHERE IDUsers = @IDUsers");
  result = await pool.request()
  .input("IDUsers", sql.Int, IDUsers)
  .query("DELETE FROM users WHERE IDUsers = @IDUsers");

    if (result.rowsAffected[0] === 0) {
      throw new Error("Không tìm thấy người dùng để xoá");
    }

    return result;
  } catch (error) {
    console.log("Lỗi khi xóa thông tin user: " + error);
    throw error;
  }
}

async function suaThongTinUser(IDUsers, HoTen, Quyen, UserName) {
  try {
    
    let result = await pool
      .request()
      .input("IDUsers", sql.Int, IDUsers)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("Quyen", sql.NChar, Quyen)
      .input("UserName", sql.VarChar, UserName)
      .query("UPDATE users SET HoTen = @HoTen, Quyen = @Quyen, UserName = @UserName WHERE IDUsers = @IDUsers");
    return result;
  } catch (error) {
    console.log("Lỗi khi sửa thông tin user: " + error);
    throw error;
  }
}

// cấu hình email
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dangtuanthanh265@gmail.com',
    pass: 'bmjaspfmsgqhpmhp' // Sử dụng biến môi trường EMAIL_PASSWORD
  }
});
// Hàm gửi thông tin của người dùng
async function thongtin(data) {
  try {
    
    let mailOptions = {
      from: 'dangtuanthanh265@gmail.com',
      to: 'cuathanhday265@gmail.com',
      subject: 'Thông báo về việc có đơn thuê xe mới',
      text: `Chào bạn. Đã có đơn hàng mới. 
      Thông tin đơn hàng: 
      Họ Tên: ${data.HoTen}, 
      Email: ${data.Email},
      ...
      Hãy truy cập trang quản trị để xem thông tin chi tiết. `
    };
    let res = await pool
      .request()
      .input("HoTen", sql.NVarChar, data.HoTen)
      .input("Email", sql.VarChar, data.Email)
      .input("DiemNhan", sql.NVarChar, data.DiemNhan)
      .input("NgayNhan", sql.DateTime, data.NgayNhan)
      .input("DiemTra", sql.NVarChar, data.DiemTra)
      .input("NgayTra", sql.DateTime, data.NgayTra)
      .execute("ThemThongTin");
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        throw error;
      } else {
        console.log('Email đã được gửi: ' + info.response);
      }
    });
    return res;
  } catch (error) {
    console.log("Lỗi khi sửa thông tin user: " + error);
    throw error;
  }
}
// Hàm xuất thông tin theo idid
async function contact(idContact) {
  try {
    
    let result = await pool
      .request()
      .input("idContact", sql.Int, idContact)
      .query(
        "SELECT [HoTen], [Email], [DiemNhan], [NgayNhan], [DiemTra], [NgayTra] FROM [dbo].[ThongTin] WHERE [ID] = @idContact"
      );

    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Contact: " + error);
    throw error;
  }
}
// Hàm xuất thông tin liên hệ
async function getcontact() {
  try {
    
    let result = await pool.request().query("SELECT * FROM Thongtin");
    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Xe: " + error);
  }
}
// Hàm tính toán giá thuê xe dựa trên số ngày thuê
// Hàm xử lý lấy giá thuê xe dựa trên số ngày thuê và mã loại xe
async function getgia(numberOfDays, maLoaiXe) {
  try {
    // Truy vấn giá thuê xe dựa trên số ngày thuê và mã loại xe
    const query = `
      SELECT Gia
      FROM DICHVU
      WHERE NgayThue <= GETDATE() AND MaLoaiXe = @MaLoaiXe
      ORDER BY NgayThue DESC
    `;

    const result = await pool
      .request()
      .input('MaLoaiXe', sql.Int, maLoaiXe)
      .query(query);

    // Tính giá thuê dựa trên số ngày thuê
    const gia = result.recordset[0].Gia * numberOfDays;
    return gia;
  } catch (err) {
    console.log('Lỗi truy vấn cơ sở dữ liệu:', err);
    throw new Error('Lỗi truy vấn cơ sở dữ liệu');
  }
}

//todo Hàm xử lý riêng để lấy thông tin xe và giá dịch vụ
async function getThongTinXe() {
  try {
    
    let result = await pool.request().query("SELECT XE.*, DICHVU.Gia   FROM XE INNER JOIN DICHVU ON XE.MaLoaiXe = DICHVU.MaLoaiXe");
    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Xe: " + error);
  }
}
//user theo idid
async function getuser(IDUsers) {
  try {
    
    let result = await pool
      .request()
      .input("IDUsers", sql.Int, IDUsers)
      .query(
        "SELECT * FROM [dbo].[users] WHERE [IDUsers] = @IDUsers"
      );

    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Contact: " + error);
    throw error;
  }
}
//xe theo mã xe
async function getxe(maxe) {
  try {
    
    let result = await pool
      .request()
      .input("maxe", sql.Int, maxe)
      .query(
        "SELECT * FROM [dbo].[XE] WHERE [maxe] = @maxe"
      );

    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Contact: " + error);
    throw error;
  }
}


//Kiểm tra xác thực email
async function CheckEmail(Email) {
  try {
    
    let result = await pool
      .request()
      .input("Email", sql.VarChar, Email.Email)
      .query(
        "SELECT Email FROM KhachHang WHERE Email = @Email"
      );

    if (result.recordset.length === 0) {
      return { success: false, message: "Email này chưa được đăng ký!" };
    } else {
      sendMail(result.recordset[0].Email)
    }
  } catch (error) {
    console.log("Lỗi khi kiểm tra email " + error);
  }
}
//Hàm gửi email
var randomNumber = Math.floor(Math.random() * 9000) + 1000;
function sendMail(emailNguoiDung){
  let mailOptions = {
    from: 'dangtuanthanh265@gmail.com',
    to: `${emailNguoiDung}`,
    subject: `Mã xác nhận cho email ${emailNguoiDung}`,
    text: `Chào bạn, đây là mã xác nhận:  ${randomNumber}`
    
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      throw error;
    } else {

      console.log('Email đã được gửi: ' + info.response);
    }
  });
}

async function xacnhanma(maxacnhan) {
  try {
    if (parseInt(maxacnhan.ma) === randomNumber){
      randomNumber = Math.floor(Math.random() * 9000) + 1000;
      return { success: true, message: "Xác nhận thành công !" };
    }else {
      return { success: false, message: "Mã xác thực không hợp lệ !" };
    }
  } catch (error) {
    console.log("Lỗi khi kiểm tra mã xác nhận " + error);
  }
}

//todo: Thêm bài viết
async function dangbai(data,sessionID) {
  try {
    
    let resultsessionID = await pool
      .request()
      .input("SessionID", sql.NVarChar, sessionID)
      .query(
        "SELECT IDUsers, TimeSession FROM users WHERE SessionID = @SessionID"
      );

    if (resultsessionID.recordset.length === 0) {
      return { success: false, message: "Bạn hãy đăng nhập lại!" };
    }
    const timeSession = resultsessionID.recordset[0].TimeSession;
    const currentTime = new Date();

    if (currentTime > timeSession) {
      return { success: false, message: "Bạn hãy đăng nhập lại!!" };
    }


    let result = await pool
      .request()
      .input("MaBai", sql.Int, data.MaBai)
      .input("TenBaiDang", sql.NVarChar, data.TenBaiDang)
      .input("NoiDung", sql.NVarChar, data.NoiDung)
      .input("HinhAnh", sql.NVarChar, data.HinhAnh)
      .input("BienSo", sql.VarChar, data.BienSo)
      .input("GiaThue", sql.Float, data.GiaThue)
      .input("DiaDiemCoXe", sql.NVarChar, data.DiaDiemCoXe)
      .input("IDUsers", sql.Int, resultsessionID.recordset[0].IDUsers)
      .execute("ThemBaiViet");
    return { success: true, message: "Thêm Bài Viết Thành Công" };
  } catch (error) {
    console.log("Lỗi khi thêm bài viết: " + error);
  }
}

//xử lý tải bải viết
async function laybaiviet() {
  try {
    
    let res = await pool.request().query("SELECT * FROM BaiDang");
    return res.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Bài Viết :" + error);
  }
}

//todo: Xóa bài viết ở trang admin
async function xoabaiviet(MaBaiViet) {
  try {
    
    let result = await pool
      .request()
      .input("MaBai", sql.Int, MaBaiViet)
      .query(`DELETE FROM BaiDang WHERE MaBai = ${MaBaiViet}`)
    return result;
  } catch (error) {
    console.log("Lỗi khi xóa thông tin: " + error);
    throw error;
  }
}

// Hàm get 1 bài viết theo id
async function lay1baiviet(MaBai) {
  try {
    
    let result = await pool
      .request()
      .input("MaBai", sql.Int, MaBai)
      .query(
        "SELECT * FROM BaiDang WHERE MaBai = @MaBai"
      );

    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu  " + error);
    throw error;
  }
}

async function duyetbai(MaBai, TrangThai) {
  try {
    
    let result = await pool
      .request()
      .input("MaBai", sql.Int, MaBai)
      .input("TrangThai", sql.Bit, TrangThai)
      .query("UPDATE BaiDang SET TrangThai = @TrangThai WHERE MaBai = @MaBai");
    return result;
  } catch (error) {
    console.log("Lỗi khi sửa thông tin " + error);
    throw error;
  }
}

//todo: Hàm hiển thị bài viết theo user đăng nhập
async function layIDUsersBangSessionID(sessionID) {
  try {
    let result = await pool
      .request()
      .input('SessionID', sql.NVarChar, sessionID)
      .query('SELECT IDUsers FROM users WHERE SessionID = @SessionID');

    return result;
  } catch (error) {
    console.log('Lỗi khi lấy IDUsers từ SessionID: ' + error);
    throw error;
  }
}

async function layDanhSachBaiViet(IDUsers) {
  try {
    let result = await pool
      .request()
      .input('IDUsers', sql.Int, IDUsers)
      .query('SELECT * FROM BaiDang WHERE IDUsers = @IDUsers AND TrangThai = 1');

    return result;
  } catch (error) {
    console.log('Lỗi khi lấy danh sách bài viết: ' + error);
    throw error;
  }
}


// Kiểm tra tồn tại bài viết và quyền sở hữu
async function kiemTraBaiVietCuaNguoiDung(IDUsers, MaBai) {
 
 let result = await pool
      .request()
      .input('MaBai', sql.int, MaBai)
      .input('IDUsers', sql.int, IDUsers)
      .query('SELECT * FROM BaiViet WHERE IDUsers = @IDUsers AND MaBai = @MaBai');

    
  return result.recordset;
}

// Cập nhật nội dung bài viết
async function capNhatNoiDungBaiViet(MaBai, updatedContent) {
  const query = `UPDATE BaiViet SET NoiDung = @updatedContent WHERE MaBai = @MaBai`;
   let result = await pool
      .request()
      .input('MaBai', sql.int, MaBai)
      .input('updatedContent', sql.NVarChar, updatedContent)
      .query(query);


  return ('Sửa thành công');
    
}


//Xử lý tìm kiếm dữ liệu: 
async function searchData(TenBang, columnName, Search) {
  try {
    // Giải mã chuỗi tìm kiếm từ URL encoding
    const decodedSearch = decodeURIComponent(Search);
    let pool = await sql.connect(config);
    const query = `SELECT * FROM ${TenBang} WHERE ${columnName} LIKE @Search`;
    let res = await pool.request()
      .input('Search', sql.NVarChar(50), `%${decodedSearch}%`)
      .query(query);
    if (res.recordset.length > 0) {
      return res.recordset;
    } else {
      const errorMessage = `Không tìm thấy ${decodedSearch} trong cột ${columnName}`;
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    throw error;
  }
}
async function searchData(TenBang, columnName, Search) {
  try {
    // Giải mã chuỗi tìm kiếm từ URL encoding
    const decodedSearch = decodeURIComponent(Search);
    let pool = await sql.connect(config);
    const query = `SELECT * FROM ${TenBang} WHERE ${columnName} LIKE @Search`;
    let res = await pool.request()
      .input('Search', sql.NVarChar(50), `%${decodedSearch}%`)
      .query(query);
    if (res.recordset.length > 0) {
      return res.recordset;
    } else {
      const errorMessage = `Không tìm thấy ${decodedSearch} trong cột ${columnName}`;
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    throw error;
  }
}

//Todo: Hàm xử lý hiển thị bài viết


async function hienthibaiviet() {
  try {
    
    let result = await pool.request().query(`
    SELECT  b.[MaBai]
      ,b.[TenBaiDang]
      ,b.[NoiDung]
      ,b.[HinhAnh]
      ,b.[BienSo]
      ,b.[GiaThue]
      ,b.[DiaDiemCoXe]
      ,u.[HoTen]
    FROM BaiDang AS b
    JOIN users AS u ON b.[IDUsers] = u.[IDUsers]
    WHERE b.[TrangThai] = 1
  `);
    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu user: " + error);
  }
}

async function layuserid(IDUsers) {
  try {
    
    let result = await pool
      .request()
      .input("IDUsers", sql.Int, IDUsers)
      .query(
        "SELECT * FROM [dbo].[users] WHERE [IDUsers] = @IDUsers"
      );

    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu user: " + error);
    throw error;
  }
}

module.exports = {
  layxe: layxe,
  layuser: layuser,
  dangKy: dangKy,
  dangNhap: dangNhap,
  SessionID: SessionID,
  suaxe: suaxe,
  themxe: themxe,
  xoaxe: xoaxe,
  themSuaAnhXe: themSuaAnhXe,
  xoauser: xoauser,
  suaThongTinUser: suaThongTinUser,
  thongtin:thongtin,
  contact: contact,
  getgia: getgia,
  getcontact:getcontact,
  getThongTinXe:getThongTinXe,
  getuser:getuser,
getxe:getxe,
CheckEmail:CheckEmail,
xacnhanma:xacnhanma,
dangbai:dangbai,
laybaiviet:laybaiviet,
xoabaiviet:xoabaiviet,
lay1baiviet:lay1baiviet,
duyetbai:duyetbai,
layDanhSachBaiViet:layDanhSachBaiViet,
layIDUsersBangSessionID:layIDUsersBangSessionID,
kiemTraBaiVietCuaNguoiDung:kiemTraBaiVietCuaNguoiDung,
searchData:searchData,
capNhatNoiDungBaiViet:capNhatNoiDungBaiViet,
  hienthibaiviet:hienthibaiviet,
layuserid:layuserid,
};
