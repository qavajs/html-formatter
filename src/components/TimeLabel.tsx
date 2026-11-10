import ClockIcon from '@epam/assets/icons/common/action-schedule-outline-18.svg?react';
import { IconContainer } from '@epam/loveship';
import css from '../App.module.scss';

export const TimeLabel = ({ time }: { time: string }) => <span className={css.timeLabel}>
    <IconContainer cx={css.timeIcon} icon={ClockIcon}/>
    <span>{time}</span>
</span>;
