import { Td, Tr } from "@chakra-ui/react";
import { DateElement } from "@components/Date/Date";
import { Log } from "@models/Log";
import { ActionBadge } from "./ActionBadge";
import { CardCell } from "./CardCell";
import { DeviceBadge } from "./DeviceBadge";
import { ProfileCell } from "./ProfileCell";
export const LogTableRow = ({ log }: { log: Log }) => {
  return (
    <>
      <Tr>
        <Td>
          <DateElement
            localeIdentifier="dk-DK"
            timestamp={log?.timestamp}
            type="long"
          />
        </Td>
        <Td>
          <ActionBadge log={log} />
        </Td>
        <Td>
          <DeviceBadge log={log} />
        </Td>
        <Td>
          <ProfileCell log={log} />
        </Td>
        <Td isNumeric>
          <CardCell log={log} />
        </Td>
      </Tr>
    </>
  );
};
