import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import queryString from "query-string";
import { getCoins } from "utils/api";
import { MainCharts, TableHead, TableData } from "components";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

class Coins extends React.Component {
  state = {
    allCoins: [],
    hasMore: true,
    page: 0,
    isLoading: false,
    hasError: false,
    errorMessage: "",
    tableColumns: {
      market_cap_rank: "#",
      id: "Name",
      current_price: "Price",
      price_change_percentage_1h_in_currency: "1h%",
      price_change_percentage_24h_in_currency: "24h%",
      price_change_percentage_7d_in_currency: "7d%",
      total_volume: "24h Volume",
      market_cap: "Market Cap",
      circulating_and_supply: "Circulating/Total Supply",
      total_supply: "Last 7d",
    },
    selection: "",
    sort: null,
  };

  sortingManager = async (selection) => {
    let sort, newSelection;
    switch (this.state.sort) {
      case null:
        sort = true;
        newSelection = selection.concat("_asc");
        break;
      case true:
        sort = false;
        newSelection = selection.concat("_desc");
        break;
      case false:
        sort = null;
        newSelection = "market_cap_desc";
        break;
    }
    await getCoins({ sort, newSelection, vs_currency: this.props.currency });
    this.setState({ sort, selection });
  };

  handleInfiniteScroll = async () => {
    this.setState({ isLoading: true });
    const { page, allCoins } = this.state;
    const newPage = page + 1;
    const newData = await getCoins({
      page: parseInt(newPage),
      vs_currency: this.props.currency,
    });
    const hasMoreCoins = !!newData.length;
    // for testing purposes //////////////////////////
    // localStorage.setItem("storedData", JSON.stringify(newAllCoins));
    ////////////////////////////
    if (hasMoreCoins) {
      const newAllCoins = [...allCoins, ...newData];
      setTimeout(() => {
        this.setState({
          isLoading: false,
          hasError: false,
          allCoins: newAllCoins,
          page: newPage,
          hasMore: hasMoreCoins,
        });
      }, 1500);
    } else {
      this.setState({
        isLoading: false,
        hasError: true,
        errorMessage: newData.errorMessage,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.selection !== this.state.selection ||
      prevState.sort !== this.state.sort
    ) {
      const { selection, sort } = this.state;
      const query = queryString.stringify({
        selection,
        sort,
        vs_currency: this.props.currency,
      });
      this.props.history.push(`/?${query}`);
    }
  };

  componentDidMount = () => {
    // for testing purposes //////////////////////////
    // const storedData = JSON.parse(localStorage.getItem("storedData")) || {};
    ////////////////////////////
    this.handleInfiniteScroll();
    const parsed = queryString.parse(this.props.location.search, {
      parseBooleans: true,
    });
    this.setState({
      parsed,
      // for testing purposes //////////////////////////
      // allCoins: storedData
      ////////////////////////////
    });
  };

  render() {
    const { allCoins, sort, selection, tableColumns, hasMore } = this.state;
    let sortedAllCoins = allCoins.map((item) => item);

    if (sort === true || sort === false) {
      sortedAllCoins = [...sortedAllCoins];
      sortedAllCoins.sort((a, b) => {
        const isId = selection === "id";
        if (isId) {
          const alphabetAtoZ = a.id.localeCompare(b.id);
          const alphabetZtoA = b.id.localeCompare(a.id);
          return sort ? alphabetAtoZ : alphabetZtoA;
        } else {
          const ascendingNumbers = a[selection] - b[selection];
          const descendingNumbers = b[selection] - a[selection];
          return sort ? ascendingNumbers : descendingNumbers;
        }
      });
    }

    return (
      <div className="overflow-auto">
        <InfiniteScroll
          dataLength={allCoins.length}
          next={this.handleInfiniteScroll}
          hasMore={hasMore}
          loader={
            !this.state.hasError && (
              <h1 className="text-black dark:text-white text-center">
                Loading...
              </h1>
            )
          }
          endMessage={
            !this.state.hasMore && (
              <h1 className="text-black dark:text-white text-center">
                All coins have been loaded!
              </h1>
            )
          }
        >
          <div className="text-black dark:text-white w-[95%] mx-auto mt-24 mb-0 px-0 py-2.5">
            <MainCharts currency={this.props.currency} />
            <h1 className="text-3xl text-black font-bold dark:text-white py-6">
              Market Overview
            </h1>
            <div className="bg-white dark:bg-[#191b1f] w-full mx-auto rounded-lg">
              <table className="mx-auto w-[95%] overflow-hidden">
                <thead>
                  <tr className="h-24">
                    {Object.entries(tableColumns).map((item) => {
                      return (
                        <TableHead
                          item={item}
                          tableColumns={tableColumns}
                          sortingManager={this.sortingManager}
                          key={item}
                        />
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedAllCoins.map((item) => {
                    return (
                      <TableData
                        isLoading={this.state.isLoading}
                        item={item}
                        allCoins={allCoins}
                        sort={sort}
                        selection={selection}
                        currency={this.props.currency}
                        key={item.id}
                      />
                    );
                  })}
                  {this.state.isLoading && (
                    <tr>
                      <td colSpan="10">
                        <Skeleton count={10} />
                      </td>
                    </tr>
                  )}
                  {this.state.hasError && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        {this.state.errorMessage.message}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default Coins;
