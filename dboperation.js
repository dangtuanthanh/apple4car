var config = require("./dbconfig"); //require() dùng để tải file hoặc gói
const sql = require("mssql"); //tải module mssql
const bcrypt = require("bcrypt"); // dùng để mã hoá mật khẩu
//const { format } = require('date-fns'); //ép định dạng cho ngày tháng năm
//const argon2 = require('argon2');
//const bcrypt = require('bcryptjs');
//const crypto = require('crypto');

//xử lý tải dữ liệu xe
async function layuser() {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query("SELECT * FROM users");
    return res.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu User :" + error);
  } finally {
    sql.close();
  }
}

// Hàm đăng ký
async function dangKy(data) {
  try {
    let pool = await sql.connect(config);
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
  } finally {
    sql.close();
  }
}

// Hàm đăng nhập
async function dangNhap(data, res) {
  try {
    let pool = await sql.connect(config);
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
        await sql.query`UPDATE users SET SessionID = ${sessionID} WHERE IDUsers = ${userID}`;

        //res.cookie('ss', sessionID, { maxAge: 3600000, httpOnly: true });
        //res.cookie('ss2', 'aaaa', { maxAge: oneDay, httpOnly: true, secure: false });
        return {
          success: true,
          message: "Đăng nhập thành công!",
          cookieValue: sessionID,
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
  } finally {
    sql.close();
  }
}

//hàm lấy thông tin từ sessionID
async function SessionID(sessionID) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SessionID", sql.NVarChar, sessionID.sessionID)
      .query(
        "SELECT IDUsers, HoTen, UserName,Quyen FROM users WHERE SessionID = @SessionID"
      );

    if (result.recordset.length === 0) {
      return { success: false, message: "Bạn hãy đăng nhập lại!" };
    }
    return result.recordset;
  } catch (error) {
    console.log("Lỗi khi kiểm tra SessionID: " + error);
  } finally {
    sql.close();
  }
}

//todo: lấy thông tin xe
async function layxe() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM xe");
    return result.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu Xe: " + error);
  } finally {
    sql.close();
  }
}
//todo: Thêm thông tin xe
async function themxe(MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("MaXe", sql.VarChar, MaXe)
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
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("MaXe", sql.INT, MaXe)
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
    let pool = await sql.connect(config);
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
module.exports = {
  layxe: layxe,
  layuser: layuser,
  dangKy: dangKy,
  dangNhap: dangNhap,
  SessionID: SessionID,
  suaxe: suaxe,
  themxe: themxe,
  xoaxe: xoaxe,
};
