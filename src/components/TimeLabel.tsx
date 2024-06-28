import {ReactComponent as ClockIcon} from "@epam/assets/icons/common/action-schedule-outline-18.svg";
import {IconContainer, Text} from "@epam/loveship";

export const TimeLabel = (props: { time: string }) => {
    return <>
        <IconContainer style={{fill: 'whitesmoke'}} icon={ClockIcon}/>
        <Text fontSize='16'>{props.time}</Text>
    </>
}
