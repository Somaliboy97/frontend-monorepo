import { ReactElement } from "react";
import RadiantShieldIcon from "./RadiantShieldIcon";
import { DISCORD_ZK_URL } from "./constants";
import Card, { CardVariant } from "src/ui/base/Card/Card";
import HashString from "src/ui/base/HashString";
import { ButtonVariant } from "src/ui/base/Button/styles";
import AnchorButton from "src/ui/base/Button/AnchorButton";
import Image from "next/image";
import { t, jt } from "ttag";
import classNames from "classnames";

const discordServerLink = (
  <a
    key="discordServerLink"
    href={DISCORD_ZK_URL}
    target="_blank"
    rel="noreferrer"
    className="text-yieldLightBlue"
  >
    {t`Element Discord Server`}
  </a>
);

interface DiscordShareCardProps {
  className?: string;
  publicId: string;
}

export default function DiscordShareCard({
  className,
  publicId,
}: DiscordShareCardProps): ReactElement {
  return (
    <Card className={className} variant={CardVariant.BLUE}>
      <div className="flex flex-col items-center justify-center gap-2 px-4 pt-3 pb-4 text-center text-white md:px-14 md:pt-8 md:pb-14">
        <RadiantShieldIcon className="mb-5" />
        <div className="flex flex-col items-stretch">
          <h1 className="mb-4 text-3xl font-semibold">{t`Public ID Successfully Created`}</h1>
          <p className="w-0 min-w-full">{jt`Use the command below in the ${discordServerLink} to associate your new Public ID with your Discord ID. You'll see a confirmation message from the Public ID Collection Bot after it's submitted.`}</p>
        </div>

        <HashString
          label={t`Discord Command`}
          className="mb-10"
          showCopyButton
          inputProps={{
            className: classNames(
              "bg-white/10 !border-white/20 !text-white !tracking-normal !font-normal",
            ),
            value: t`/submitpublicid public-id:${publicId}`,
            readOnly: true,
          }}
        />
        <div className="flex gap-12">
          <AnchorButton
            variant={ButtonVariant.GRADIENT}
            href={DISCORD_ZK_URL}
            className="flex gap-2"
            target="_blank"
          >
            {t`Go to Discord`}
            <Image
              width={24}
              height={24}
              src="/assets/discordlogo--light.svg"
              alt=""
            />
          </AnchorButton>
        </div>
      </div>
    </Card>
  );
}
