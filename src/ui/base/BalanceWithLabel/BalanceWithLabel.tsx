import { ReactElement } from "react";
import classNames from "classnames";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { formatBalance } from "src/formatBalance";
import { ElementIcon, IconSize } from "src/ui/base/ElementIcon/ElementIcon";
import Tooltip from "src/ui/base/Tooltip/Tooltip";

interface BalanceWithLabelProps {
  className?: string;
  tooltipText?: string;
  tooltipHref?: string;
  label: string;
  balance: string;
}

export function BalanceWithLabel(props: BalanceWithLabelProps): ReactElement {
  const { className, tooltipText, tooltipHref, label, balance } = props;

  return (
    <div className={classNames("text-white", className)}>
      {/* Balance */}
      <div className="flex items-center">
        <span className="mr-2 text-2xl font-extralight">
          {formatBalance(balance, 4)}
        </span>
        <ElementIcon size={IconSize.MEDIUM} />
      </div>

      {/* Label */}
      <div className="flex items-center">
        <span className="mb-1 mr-2 text-xl">{label}</span>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            {tooltipHref ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={tooltipHref}
                className="underline"
              >
                <InformationCircleIcon className="h-4" />
              </a>
            ) : (
              <InformationCircleIcon className="h-4 cursor-help" />
            )}
          </Tooltip>
        )}
      </div>
    </div>
  );
}
