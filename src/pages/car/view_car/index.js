import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { BsSearch } from "react-icons/bs";

const ViewCar = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://apple4car.onrender.com/layxe")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  //popup
  const [show, setShow] = useState(false);
  //add data

  const [editing, setEditing] = useState("");

  const [id, setId] = useState("");
  const [MaXe, setMaXe] = useState("");
  const [TenXe, setTenXe] = useState("");
  const [MaLoaiXe, setMaLoaiXe] = useState("");
  const [BienSo, setBienSo] = useState("");
  const [GhiChu, setGhiChu] = useState("");
  const [Anh, setAnh] = useState("");
  const [Change, setChange] = useState("");

  const handle = () => {
    if (Change) {
      handleUpdate();
    } else {
      handleAddData();
    }
  };

  const [title, setTitle] = useState([
    "STT",
    "Mã xe",
    "Tên xe",
    "Mã loại xe",
    "Biển số",
    "Trạng thái",
    "Ảnh",
    "Hành động",
  ]);

  //hàm thêm
  const handleAddData = async () => {
    const newData = { MaXe, TenXe, MaLoaiXe, BienSo, GhiChu, Anh };
    const input = document.getElementById("anhXeInput");
    const ipMaXe = document.getElementById("inputMaxe").value;
    console.log(document.getElementById("inputMaxe"));
    console.log(ipMaXe);
    const file = input.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      fetch(`https://apple4car.onrender.com/themxe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          // Xử lý kết quả từ API 1
          const uploadUrl = `https://apple4car.onrender.com/uploadAnhXe/${MaXe}`;
          const formData = new FormData();
          formData.append("image", file);

          fetch(uploadUrl, {
            method: "POST",
            body: formData,
          })
            .then((uploadResponse) => uploadResponse.json())
            .then((uploadResult) => {
              // Xử lý kết quả từ API 2
              alert(uploadResult.message);
              setData([...data]);
              setMaXe("");
              setTenXe("");
              setMaLoaiXe("");
              setBienSo("");
              setGhiChu("");
              setAnh();
            });
        });
    } catch (error) {
      console.error(error);
    }
  };

  // hàm sửa

  const HandleEdit = () => {
    fetch(`https://apple4car.onrender.com/layxe/${MaXe}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi tải thông tin người dùng");
        }
        return response.json();
      })
      .then((data) => {
        setMaXe(data.MaXe);
        setTenXe(data.TenXe);
        setMaLoaiXe(data.MaLoaiXe);
        setBienSo(data.BienSo);
        setGhiChu(data.GhiChu);
        setAnh();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleUpdate = (event) => {
    event.preventDefault();
        Promise.all([
          fetch(`https://apple4car.onrender.com/suaxe/${MaXe}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              MaXe,
              TenXe,
              MaLoaiXe,
              BienSo,
              GhiChu,
              Anh
            }),
          }),
          fetch('https://apple4car.onrender.com/layxe')
        ])
        .then(responses => {
          const [updateResponse, usersResponse] = responses;
          if (!updateResponse.ok) {
            throw new Error('Lỗi khi cập nhật thông tin người dùng');
          }
          if (!usersResponse.ok) {
            throw new Error('Lỗi khi tải danh sách người dùng');
          }
          alert('Thông tin người dùng đã được cập nhật thành công');
          return Promise.all([updateResponse.json(), usersResponse.json()]);
        })
        .then(data => {
          const [updatedUser, updatedData] = data;
          setData(updatedData);
        })
        .then(() => {
          // Đặt lại giá trị mặc định cho các trường nhập liệu
          setMaXe("");
              setTenXe("");
              setMaLoaiXe("");
              setBienSo("");
              setGhiChu("");
              setAnh();
          setEditing('');
         
          
          // Lấy lại dữ liệu mới từ server và cập nhật lại state của ứng dụng
          fetch('https://apple4car.onrender.com/layxe')
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              setData(data);
            })
            .then(() => {
              setMaXe("");
              setTenXe("");
              setMaLoaiXe("");
              setBienSo("");
              setGhiChu("");
              setAnh();
             
              setEditing('');
            })
            .catch(error => {
              console.error('Error fetching records:', error);
            });
            
        })
        .catch(error => {
          console.error(error);
        });
  };



  // hàm xóa
  const handleDelete = (MaXe) => {
    fetch(`https://apple4car.onrender.com/xoaxe/${MaXe}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true) {
          alert(response.message);
          // Thực hiện các hành động sau khi đăng nhập thành công
        } else {
          alert(response.message);
          // Thực hiện các hành động khi đăng nhập thất bại
        }
      });

    const newCars = data.filter((car) => car.MaXe !== MaXe);
    setData(newCars);
  };

  // ham lưu tru giá tri ô tìm kiếm
  const [searchValue, setSearchValue] = useState("");
  // chức năng tìm kiếm
  const filteredData = data.filter((cars) => {
    const searchRegex = new RegExp(searchValue, "i");
    return (
      searchRegex.test(cars.MaXe) ||
      searchRegex.test(cars.TenXe) ||
      searchRegex.test(cars.MaLoaiXe) ||
      searchRegex.test(cars.BienSo) ||
      searchRegex.test(cars.GhiChu) ||
      searchRegex.test(cars.Anh)
    );
  });

  //nút thoát
  const handleExitAndShow = () => {
    // handleExit();
    setShow(!show);
    // setHideEditImage(true);
  };

  //xem trước ảnh
  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setAnh(fileUrl);
  };
  // làm mới trường nhập

  return (
    <ViewC>
      <div className="navContainer">
        <div className="navSearch">
          <BsSearch className="iconSearch" />
          <input
            className="navInput"
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <button className="navButtonAdd" onClick={() => setShow(!show)}>
          Thêm xe
        </button>
      </div>

      <div className="viewContainer">
        <table className="tbl">
          <tr className="title-data">
            {title.map((t) => {
              return <th key={t}>{t}</th>;
            })}
          </tr>
          {filteredData.map((u, index) => (
            <tr
              id="listViewData"
              className={`user-item-${index} ${
                index % 2 === 1 ? "even-row" : ""
              }`}
            >
              <td data-lable="STT" key={index}>
                {index + 1}
              </td>
              <td data-lable="Mã xe" key={u.MaXe}>
                {u.MaXe}
              </td>
              <td data-lable="Tên xe" key={u.TenXe}>
                {u.TenXe}
              </td>
              <td data-lable="Mã loại xe" key={u.MaLoaiXe}>
                {u.MaLoaiXe}
              </td>
              <td data-lable="Biển số" key={u.BienSo}>
                {u.BienSo}
              </td>
              <td data-lable="Ghi chú" key={u.GhiChu}>
                {u.GhiChu}
              </td>
              {/* <td data-lable='Email' key={u.email}>{u.email}</td> */}

              <td className="avt-data" data-lable="Hình ảnh" key={u.Anh}>
                {u.Anh && (
                  <img
                    className="avt"
                    src={u.Anh.replace("http:", "https:")}
                    alt={"ảnh " + (index + 1)}
                    style={{ width: "64px", height: "36px" }}
                  />
                )}
              </td>

              <td data-lable="Chỉnh sửa">
                {" "}
                <LiaUserEditSolid
                  onClick={() => {
                    HandleEdit(u.MaXe);
                    setShow(!show)
                  }}
                  style={{ color: "#ffab00", marginRight: "10" }}
                  className="iconEdit"
                />{" "}
                <MdDelete
                  onClick={() => handleDelete(u.MaXe)}
                  style={{ color: "#fc424a" }}
                  className="iconDelete"
                />{" "}
              </td>

              <td></td>
            </tr>
          ))}
        </table>
      </div>

      {show && (
        <div className="addContainer">
          {editing ? (
            <h1 style={{ marginBottom: "50px", fontSize: "1.5em" }}>{}</h1>
          ) : (
            <h1
              style={{
                marginBottom: "50px",
                fontSize: "2.5em",
                fontWeight: "bold",
                color: "#8f5fe8",
              }}
            >
              Thông tin
            </h1>
          )}

          <div className="addItemInput">
            <label> Mã xe: </label>
            <input
              id="inputMaxe"
              onChange={(e) => setMaXe(e.target.value)}
              value={MaXe}
              type="text"
              name="MaXe"
              placeholder="Nhập mã xe"
            />
          </div>

          <div className="addItemInput">
            <label> Tên xe: </label>
            <input
              onChange={(e) => setTenXe(e.target.value)}
              value={TenXe}
              type="text"
              name="TenXe"
              placeholder="Nhập tên xe"
            />
          </div>

          <div className="addItemInput">
            <label> Mã loại xe: </label>
            <input
              onChange={(e) => setMaLoaiXe(e.target.value)}
              value={MaLoaiXe}
              type="text"
              name="MaLoaiXe"
              placeholder="Nhập mã loại xe"
            />
          </div>

          <div className="addItemInput">
            <label> Biển số: </label>
            <input
              onChange={(e) => setBienSo(e.target.value)}
              value={BienSo}
              type="text"
              name="BienSo"
              placeholder="Nhập biển số xe"
            />
          </div>

          <div className="addItemInput">
            <label> Ghi chú: </label>
            <input
              onChange={(e) => setGhiChu(e.target.value)}
              value={GhiChu}
              type="text"
              name="GhiChu"
              placeholder="Nhập ghi chú"
            />
          </div>

          <div className="inputAvt">
            <div
              className="addItemInput"
              style={{ justifyContent: "space-between" }}
            >
              <label>Hình ảnh:</label>

              <div className="iteamInputImage" style={{ width: "100" }}>
                <input
                  id="anhXeInput"
                  type="file"
                  onChange={handlePreviewAvatar}
                  accept="image/*"
                  // onChange={handlePreviewAvatar}
                  style={{
                    marginTop: 8,
                    right: 0,
                    width: 93,
                    left: 0,
                    padding: 0,
                  }}
                />

                <div className="imputImage">
                  {Anh && <img src={Anh} alt="Preview Avatar" width="20%" />}
                </div>
              </div>
            </div>
          </div>

          <div className="buttonPopup">
            <button className="addButtonAdd cancel" onClick={handleExitAndShow}>
              Thoát
            </button>

            <button className="addButtonAdd add" onClick={handle}>
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </ViewC>
  );
};
export default ViewCar;
const ViewC = styled.div`
  margin-left: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 70vw;

  .viewContainer {
    padding: 0 2vw;
    border-radius: 20px;
    background-color: #191c24;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  img {
  }
  tr,
  th,
  td {
    text-align: center;
    padding: 15px;
  }
  tr,
  td {
  }
  .tbl {
  }
  td {
    border-top: 1px solid #2c2e33;
    vertical-align: middle;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: nowrap;
  }
  .navContainer {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin: 5px 60px;
    margin-bottom: 40px;
    background-color: #191c24;
    padding: 12px 0;
    border-radius: 20px;
  }
  .navSearch {
    margin-right: 5vw;
    display: flex;
    justify-content: flex-end;
  }
  .navButtonAdd {
    display: inline-block;
    font-size: 1em;
    font-weight: bold;
    width: 20vw;
    padding: 8px 10px;
    color: #fff;
    background-color: #0090e7;
    border-color: #0090e7;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    overflow: hidden;

    &:hover {
      color: #fff;
      background-color: #0078c1;
      border-color: #0070b4;
    }
  }
  .iconSearch {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #000;
    transform: translateX(34px) translateY(10px);
  }
  .navContainer input {
    font-size: 18px;
    width: 20vw;
    border: 2px solid black;
    border-radius: 20px;
    padding-left: 40px;
    &:focus {
      padding-left: 40px;
      cursor: text;
    }
  }

  .addContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80vh;
    width: 80vw;
    background-color: #ccc;
    z-index: 999999;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    border: 2px solid #ccc;
    color: #000;
  }
  .addInput {
    display: flex;
    justify-content: center;
    margin: 5px 80px;
    flex-direction: column;
  }
  .addContainer input {
    font-size: 19px;
    width: 30vw;
    border: 1px solid #ccd9;
    border-radius: 10px;
    padding-left: 10px;
    cursor: text;
    margin-bottom: 20px;
  }
  .addContainer label {
    text-align: left !important;
    width: 5vw;
    font-weight: bold;
  }

  .addItemInput {
    display: flex;
    align-items: flex-start;

    flex-direction: row;
  }
  .addItemInput label {
    width: 20vw;
  }

  .addButtonAdd {
    font-size: 20px;
    font-weight: bold;
    padding: 10px 50px;
    background-color: #f05123;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    margin-right: 80px;
  }
  .add {
    background-color: #0090e7;
    border-color: #0090e7;
    &:hover {
      background-color: #0078c1;
      border-color: #0078c1;
    }
  }
  .cancel {
    background-color: #0d0d0d;
    border-color: #0d0d0d;
    &:hover {
      background-color: black;
      border-color: black;
    }
  }
  .addButtonAdd:last-of-type {
    margin-right: 0;
  }

  .inputAvt {
    display: flex;

    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .imputImage {
    width: 60px;
    height: 60px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid;
    margin-left: 5vw;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .iteamInputImage {
    width: 30vw;
    display: flex;
  }
  .iteamInputImage input {
    margintop: 8;
    right: 0;
    width: 93;
    left: 0;
    padding: 0;
  }
`;
