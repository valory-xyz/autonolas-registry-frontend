import styled from 'styled-components';
import { MEDIA_QUERY } from '@autonolas/frontend-library';

export const Container = styled.div``;

export const HeaderRow = styled.div`
  margin-top: 4rem;
  height: 60vh;
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

  ${MEDIA_QUERY.mobileL} {
    margin-top: 1rem;
    height: 80vh;
    .hero-title {
      line-height: 1;
      font-size: 40px;
    }
  }
`;

export const ContentRow = styled.div`
  max-width: 900px;
  margin: 0 auto 6rem auto;
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
    .column-1 {
      display: flex;
      justify-content: center;
    }
    .column-2 {
      .description {
        display: inline-block;
        margin-bottom: 1rem;
      }
      a {
        &::after {
          content: '→';
          vertical-align: middle;
          margin-left: 0.35rem;
        }
      }
    }
  }

  ${MEDIA_QUERY.mobileL} {
    margin-bottom: 0rem;
    .each-service {
      margin-bottom: 4rem;
    }
  }
`;
