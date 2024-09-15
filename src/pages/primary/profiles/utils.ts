import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
export function formaDuration(ms: number) {
  const time = dayjs.duration(ms);
  const days = Math.floor(time.asDays());
  const hours = time.hours();
  const minites = time.minutes();

  return `${days !== 0 ? `${days}天` : ''}${hours}小时${minites}分钟`;
}
