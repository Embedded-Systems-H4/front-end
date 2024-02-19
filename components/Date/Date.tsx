import { Tooltip, chakra } from "@chakra-ui/react";

export const DateElement = ({
  timestamp,
  localeIdentifier,
  type,
  withTooltip,
}: {
  timestamp: any;
  localeIdentifier: string;
  type: "long" | "short" | "relative";
  withTooltip?: boolean;
}) => {
  const date = new Date(timestamp) as any;
  const now = new Date() as any;
  const timeDiff = now - date;

  // Full Date (e.g., "October 19, 2023")
  const fullDate = date.toLocaleDateString(localeIdentifier, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Short Date (e.g., "10-19-23")
  const shortDate = date.toLocaleDateString(localeIdentifier, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  // Only Hour if it's from today (e.g., "2:30 PM")
  const onlyHour = date.toLocaleTimeString(localeIdentifier, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Relative Date (e.g., "2 days ago")
  const relativeDate =
    timeDiff < 86400000 ? (
      <chakra.span>today</chakra.span>
    ) : timeDiff < 172800000 ? (
      <chakra.span>yesterday</chakra.span>
    ) : (
      <chakra.span>{Math.floor(timeDiff / 86400000)} days ago</chakra.span>
    );
  return (
    <>
      {type === "long" && <chakra.span>{fullDate}</chakra.span>}
      {type === "short" && (
        <Tooltip label={withTooltip ? `${shortDate}:${onlyHour}` : null}>
          <chakra.span>{shortDate}</chakra.span>
        </Tooltip>
      )}
      {type === "relative" && (
        <Tooltip label={withTooltip ? `${shortDate} - ${onlyHour}` : null}>
          <chakra.span>
            {timeDiff < 86400000 ? onlyHour : relativeDate}
          </chakra.span>
        </Tooltip>
      )}
    </>
  );
};
