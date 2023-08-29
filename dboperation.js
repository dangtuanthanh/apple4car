var config = require("./dbconfig");//require() dùng để tải file hoặc gói
const sql = require("mssql");//tải module mssql
const bcrypt = require('bcrypt'); // dùng để mã hoá mật khẩu
//const { format } = require('date-fns'); //ép định dạng cho ngày tháng năm


//xử lý tải dữ liệu xe
async function layuser() {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query("SELECT * FROM users")
      return res.recordset;
  } catch (error) {
    console.log("Lỗi Tải Dữ Liệu User :" + error);
  }finally {
    sql.close();
  }
}


//xử lý đăng ký
async function dangKy(data) {
  try {
    let pool = await sql.connect(config);
    console.log('opera', data);
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.Pass, 10); // Số vòng lặp (salt) là 10, bạn có thể điều chỉnh tùy theo yêu cầu
    let res = await pool.request()
      .input('HoTen', sql.NVarChar, data.HoTen)
      .input('UserName', sql.VarChar, data.UserName)
      .input('Pass', sql.VarChar, hashedPassword) // Truyền mật khẩu đã được mã hóa
      .execute('dangky');
    return res.recordsets;
  } catch (error) {
    console.log("Lỗi khi đăng ký: " + error);
  }
}
module.exports = {
  layuser: layuser,
  dangKy:dangKy
};
