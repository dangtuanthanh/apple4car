import '../header_car/asset/css/style.css'
import styled from "styled-components";

const Header_car = () => {
    return (
      <HeaderCar>

      
        <nav class="navbar p-0 fixed-top d-flex flex-row">
          <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
            <a class="navbar-brand brand-logo-mini" href="index.html"><img src="" alt="logo" /></a>
          </div>
          <div class="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
            <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
              <span class="mdi mdi-menu"></span>
            </button>
            <ul class="navbar-nav w-100">
              <li class="nav-item w-100">
                <h1 style={{color:"#007bff", fontWeight: "bold"}}>Quản lý xe</h1>
              </li>
            </ul>
            <ul class="navbar-nav navbar-nav-right">
              <li>
              <div class="navbar-profile">
                <p style={{fontWeight: "bold", whiteSpace:"nowrap",}} class="mb-0 d-none d-sm-block navbar-profile-name">Chào Admin!</p>
                </div>
              </li>          
              <li class="nav-item dropdown">
                <a class="nav-link" id="profileDropdown" href="#" data-toggle="dropdown">
                  <div class="navbar-profile">
                    <img class="img-xs rounded-circle" style={{cursor:"auto"}} src={require('../img/anime2.png')} alt="" />
                    <p style={{fontWeight: "bold", cursor:"auto"}}  class="mb-0 d-none d-sm-block navbar-profile-name">APPLE4</p>
                    <i class="mdi mdi-menu-down d-none d-sm-block"></i>
                  </div>
                </a>              
              </li>
              <li>
                <button style={{fontWeight: "bold"}} type='button' class="btn btn-info btn-fw">
                  Logout
                </button>
              </li>
            </ul>
            <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
              <span class="mdi mdi-format-line-spacing"></span>
            </button>
          </div>
        </nav>
      </HeaderCar>
    )
}
export default Header_car;
const HeaderCar = styled.div`

`
