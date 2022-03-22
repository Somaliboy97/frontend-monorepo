import React, { ReactElement } from "react";
import { useWeb3React } from "@web3-react/core";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { t } from "ttag";
import { WalletProfileButton } from "src/ui/wallet/ConnectWalletButton";
import { useGasPrice } from "src/ui/ethereum/useGasPrice";
import { RESOURCES_URL } from "src/ui/resources";
import { useDeposited } from "src/ui/base/lockingVault/useDeposited";
import { ElementIcon, IconSize } from "src/ui/base/ElementIcon/ElementIcon";
import Tooltip from "src/ui/base/Tooltip/Tooltip";
import { Provider } from "@ethersproject/providers";

const GAS_URL = "https://www.etherchain.org/tools/gasnow";
const elfiTooltipText = t`The amount of voting power you own in the system`;

function Header(): ReactElement {
  const { account, active, library } = useWeb3React<Provider>();
  const { data: gasPrice } = useGasPrice();
  const amountDeposited = useDeposited(account) || "0";

  return (
    <div className="flex w-full justify-between">
      <div className="flex space-x-3"></div>
      <div className="flex items-center space-x-4 text-gray-400">
        {account ? (
          <div className="flex items-center">
            <span className="mr-8 flex items-center gap-1">
              <a
                target="_blank"
                rel="noreferrer"
                href={RESOURCES_URL}
                className="hidden items-center gap-2 lg:flex"
              >
                <span className="text-principalRoyalBlue">{t`Learn how to vote`}</span>
                <ExternalLinkIcon className="h-4 shrink-0 text-principalRoyalBlue" />
              </a>
            </span>
            <a
              href={GAS_URL}
              target="_blank"
              rel="noreferrer"
              className="mr-8 flex items-center"
            >
              <span className="relative h-5 w-5">
                <Image
                  layout="fill"
                  src="/assets/gas.svg"
                  alt={t`Gas pump icon`}
                />
              </span>
              <span className="ml-2 mr-1 font-bold text-principalRoyalBlue">
                {gasPrice?.recommendedBaseFee || 0.0}
              </span>
            </a>
            <Tooltip content={elfiTooltipText}>
              <span className="mr-8 flex items-center gap-2 font-bold text-principalRoyalBlue">
                <ElementIcon size={IconSize.MEDIUM} />
                <span>
                  {amountDeposited}
                  <span className="hidden lg:inline"> ELFI</span>
                </span>
              </span>
            </Tooltip>
          </div>
        ) : null}

        <WalletProfileButton
          account={account}
          provider={library}
          walletConnectionActive={active}
        />
      </div>
    </div>
  );
}

export default Header;
