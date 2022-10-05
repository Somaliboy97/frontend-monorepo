import { providers } from "ethers";
import { Pool, Pool__factory } from "@elementfi/core-v2-typechain";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { MultiPoolDataSource } from "./MultiPoolDataSource";
import { PoolParameters, PoolReserves } from "src/types";
import { fromBn } from "evm-bn";
import { formatUnits } from "ethers/lib/utils";

export class MultiPoolContractDataSource
  extends ContractDataSource<Pool>
  implements MultiPoolDataSource
{
  constructor(address: string, provider: providers.Provider) {
    super(Pool__factory.connect(address, provider));
  }

  getPoolIds(fromBlock?: number, toBlock?: number): Promise<number[]> {
    return this.cached(["getPoolIds", fromBlock, toBlock], async () => {
      const eventFilter = this.contract.filters.PoolRegistered();
      const events = await this.contract.queryFilter(
        eventFilter,
        fromBlock,
        toBlock,
      );
      return events.map((event) => event.args.poolId.toNumber());
    });
  }

  getMultiTerm(): Promise<string> {
    return this.call("term", []);
  }

  /**
   * Fetches and caches the pool reserves from our datasource (contract).
   * @notice This function returns reserves as string representation of a fixed point number.
   * @param {number} poolId - the pool id (expiry)
   * @return {Promise<PoolReserves>}
   */
  async getPoolReserves(poolId: number): Promise<PoolReserves> {
    const [sharesBigNumber, bondsBigNumber] = await this.call("reserves", [
      poolId,
    ]);
    const decimals = await this.call("decimals", []);

    return {
      shares: formatUnits(sharesBigNumber, decimals),
      bonds: formatUnits(bondsBigNumber, decimals),
    };
  }

  /**
   * Fetches and caches the pool parameters from our datasource (contract).
   * @notice This function also handles converting the pool parameters from a fixed point number.
   * @param {number} poolId - the pool id (expiry)
   * @return {Promise<PoolParameters>}
   */
  async getPoolParameters(poolId: number): Promise<PoolParameters> {
    const [timeStretch, muBN] = await this.call("parameters", [poolId]);

    return {
      // mu is represented as a 18 decimal fixed point number, we have to convert to a decimal
      mu: fromBn(muBN, 18),
      // timeStretch is represented as a 3 decimal fixed point number, we have to convert to a decimal
      timeStretch: (timeStretch / 1e3).toString(),
    };
  }

  /**
   * Fetches the base asset address from our datasource (contract).
   */
  getBaseAsset(): Promise<string> {
    return this.call("token", []);
  }

  /**
   * Fetches the symbol for a given poolId from our datasource (contract).
   */
  getSymbol(poolId: number): Promise<string> {
    return this.call("symbol", [poolId]);
  }

  /**
   * Fetches the number of decimals used by tokens in our datasource (contract).
   */
  getDecimals(): Promise<number> {
    return this.call("decimals", []);
  }

  /**
   * Fetches the name for a given poolId from our datasource (contract).
   */
  getName(poolId: number): Promise<string> {
    return this.call("name", [poolId]);
  }

  /**
   * Fetches an address's balance of a given poolId from our datasource (contract).
   */
  async getBalanceOf(poolId: number, address: string): Promise<string> {
    const balanceBigNumber = await this.call("balanceOf", [poolId, address]);
    return balanceBigNumber.toString();
  }
}
