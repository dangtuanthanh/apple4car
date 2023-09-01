var config = require("./dbconfig");//require() dùng để tải file hoặc gói
const sql = require("mssql");//tải module mssql
const bcrypt = require('bcrypt'); // dùng để mã hoá mật khẩu
//const { format } = require('date-fns'); //ép định dạng cho ngày tháng năm
//const argon2 = require('argon2');
//const bcrypt = require('bcryptjs');
//const crypto = require('crypto');

//xử lý tải dữ liệu xe
async function layuser() {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query("SELECT * FROM users")
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
    let res = await pool.request()
      .input('HoTen', sql.NVarChar, data.HoTen)
      .input('UserName', sql.VarChar, data.UserName)
      .input('Pass', sql.NVarChar, hashedPassword) // Truyền mật khẩu đã được mã hóa
      .execute('dangky');
    return res.recordsets;
  } catch (error) {
    console.log("Lỗi khi đăng ký: " + error);
  }
}


// Hàm đăng nhập
async function dangNhap(data) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query("SELECT * FROM users WHERE UserName = '" + data.UserName + "'");
    console.log("result.recordset:", result.recordset);

    if (result !== undefined && result.recordset.length > 0) {
      const user = result.recordset[0];
      //so sánh mật khẩu
      //const isPasswordMatch = verifyPassword(data.Pass, user.Pass);
      const isPasswordMatch = await bcrypt.compare(data.Pass, user.Pass);
      if (isPasswordMatch) {
        // Đăng nhập thành công
        return { success: true, message: 'Đăng nhập thành công!' };
      } else {
        // Mật khẩu không khớp
        return { success: false, message: 'Mật khẩu không đúng!' };
      }
    } else {
      // Người dùng không tồn tại
      return { success: false, message: 'Người dùng không tồn tại!' };
    }
  } catch (error) {
    console.log("Lỗi khi đăng nhập: " + error);
  }
}
module.exports = {
  layuser: layuser,
  dangKy: dangKy,
  dangNhap: dangNhap
};
