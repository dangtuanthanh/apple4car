import styled from "styled-components";
import ViewCar from "../view_car/index";
const SlideCar = () => {
  return (
    <SlideCars>
      <div className="slideContainer">
        <div className="title"></div>
        <div className="content">
          <table>
            <tr>
              <td>{ViewCar()} </td>
            </tr>
          </table>
        </div>
      </div>
    </SlideCars>
  );
};

export default SlideCar;
const SlideCars = styled.div`
  width: 100%;
  margin-top: 10vh;
  height: 100vh;

  th,
  td {
    text-align: center;
    padding-right: 2vw;
  }
  td:last-child {
    padding-right: 0;
  }

  .iconEdit,
  .iconDelete {
    font-size: 25px;
    cursor: pointer;
  }

  .slideContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  @media only screen and (max-width: 46.1874em) {
    .content {
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100vw;
    }
    tr {
      width: 100vw;
    }
  }
`;
