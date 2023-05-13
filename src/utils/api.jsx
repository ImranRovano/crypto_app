import axios from "axios";

export const getCoins = async (parameter) => {
  let order;
  switch (parameter.sort) {
    case true:
      order = parameter.selection.concat("_asc");
      break;
    case false:
      order = parameter.selection.concat("_desc");
      break;
    case null:
      order = "market_cap_desc";
      break;
  }

  try {
    const { data } = await axios(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${order}&per_page=50&page=${parameter.page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
    );
    return data;
  } catch (error) {
    alert(error);
  }
};

export const getMarketData = async () => {
  try {
    const { data } = await axios(`https://api.coingecko.com/api/v3/global`);
    return data.data;
  } catch (error) {
    alert(error);
  }
};
