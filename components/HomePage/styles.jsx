import styled from 'styled-components';

export const Container = styled.div``;

export const HeaderRow = styled.div`
  display: flex;
  margin-top: 2rem;
  .column-1 {
    width: 60%;
    h1 {
      font-size: 60px;
      font-weight: bold;
      line-height: 80px;
    }
    p {
      font-size: 24px;
    }
  }
  .column-2 {
    width: 40%;
    .header-image {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
`;

export const ContentRow = styled.div`
  max-width: 900px;
  .sub-title {
    font-size: 34px;
    text-transform: uppercase;
    margin: 5rem 0rem;
  }
  .each-service {
    display: flex;
    &:not(:first-child) {
      margin-top: 8rem;
    }
    .column {
      flex: 1;
    }
    .column-1 {
      display: flex;
      justify-content: center;
      .each-service-image {
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 4rem;

      }
    }
    .column-2 {
      .title {
        font-size: 20px;
        line-height: normal;
        margin-bottom: 1.5rem;
      }
      .desc {
        margin-bottom: 1.25rem;
        line-height: 1.4;
      }
      a {
        &::after {
          content: "→";
          font-size: 30px;
          vertical-align: middle;
          margin-left: 0.35rem;
        }
      }
    }
  }
`;
