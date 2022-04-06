import { lockingVaultContract } from "src/elf/contracts";
import { toast } from "react-hot-toast";
import { ContractReceipt, Signer } from "ethers";
import { UseMutationResult } from "react-query";
import { LockingVault } from "elf-council-typechain";
import {
  makeSmartContractReadCallQueryKey,
  useSmartContractTransaction,
} from "@elementfi/react-query-typechain";
import { queryClient } from "src/elf/queryClient";
import { useRef } from "react";
import { ETHERSCAN_TRANSACTION_DOMAIN } from "src/elf-etherscan/domain";
import { t, jt } from "ttag";

export function useChangeDelegation(
  address: string | null | undefined,
  signer: Signer | undefined,
): UseMutationResult<
  ContractReceipt | undefined,
  unknown,
  Parameters<LockingVault["changeDelegation"]>
> {
  const toastIdRef = useRef<string>();

  return useSmartContractTransaction(
    lockingVaultContract,
    "changeDelegation",
    signer,
    {
      onError: (e) => {
        toast.error(e.message, {
          id: toastIdRef.current,
        });
      },
      onTransactionSubmitted: (tx) => {
        const etherscanLink = (
          <a
            key="etherscan-link"
            href={`${ETHERSCAN_TRANSACTION_DOMAIN}/${tx.hash}`}
            target="_blank"
            rel="noreferrer"
            className="block underline"
          >
            {t`View on etherscan`}
          </a>
        );

        const message = (
          <div>{jt`Changing delegation... ${etherscanLink}`}</div>
        );

        toastIdRef.current = toast.loading(message);
      },
      onTransactionMined: () => {
        // Invalidate `deposits` so that consumers of `useDelegate` refresh
        queryClient.invalidateQueries(
          makeSmartContractReadCallQueryKey(
            lockingVaultContract.address,
            "deposits",
            [address as string],
          ),
        );

        toast.success(t`Delegation successfully changed`, {
          id: toastIdRef.current,
        });
      },
    },
  );
}
