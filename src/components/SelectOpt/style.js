import { css } from "@emotion/react";

export const styInput = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: ${30}px;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 20px;
    font-weight: bold;
  }

  p {
    margin-top: 30px;
  }

  > div {
    margin: 10px;
  }

  ul li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const styBtn = css`
  background: #ff9900;
  margin-top: 10px;
  padding: 5px 40px;
  font-size: 17px;
  color: #141414;
  font-weight: bold;
`;

export const styUpdateBtn = css`
  background: #141414;
  margin-top: 10px;
  padding: 5px 40px;
  font-size: 17px;
  color: white;
  font-weight: bold;
`;
