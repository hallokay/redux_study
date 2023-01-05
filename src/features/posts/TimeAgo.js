import { parseISO, formatDistanceToNow } from "date-fns";


const TimeAgo = ({timestamp}) => {
    let timeAgo = '';
    if(timestamp) {
        const date = parseISO(timestamp);
        // console.log('date', date);
        const timePeriod = formatDistanceToNow(date);
        // console.log('timePeriod' , timePeriod);
        timeAgo = `${timePeriod} ago`
    }
  return (
    <span title={timestamp}>
        &nbsp; <i>{timeAgo}</i>
    </span>
  )
}

export default TimeAgo
