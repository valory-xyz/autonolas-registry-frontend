import styled from 'styled-components';

export const Container = styled.div``;

export const HeaderRow = styled.div`
  margin-top: 4rem;
  height: 60vh;
  min-height: 400px;
  .hero-title {
    max-width: 24ch;
  }
  .lead {
    display: block;
    font-size: 24px;
    margin-bottom: 2rem;
  }
  .header-image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

export const ContentRow = styled.div`
  max-width: 900px;
  margin: 0 auto;
  .title {
    margin-bottom: 3rem;
    text-align: center;
  }
  .sub-title {
    font-size: 34px;
    margin: 5rem 0rem;
  }
  .each-service {
    display: flex;
    margin-bottom: 8rem;
    .column {
      flex: 1;
    }
    .column-1 {
      display: flex;
      justify-content: center;
      .each-service-image {
        height: 150px;
      }
    }
    .column-2 {
      .description {
        display: inline-block;
        margin-bottom: 1rem;
      }
      a {
        &::after {
          content: "→";
          vertical-align: middle;
          margin-left: 0.35rem;
        }
      }
    }
  }
`;
