import {ReactComponent as ClockIcon} from "@epam/assets/icons/common/action-clock-18.svg";
import {IconContainer, Text} from "@epam/promo";

export const TimeLabel = (props: { time: string }) => {
    return <>
        <IconContainer icon={ClockIcon}/>
        <Text fontSize='16' font='sans-semibold'>{props.time}</Text>
    </>
}
