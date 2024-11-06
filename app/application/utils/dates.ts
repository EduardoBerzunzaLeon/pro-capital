import { getLocalTimeZone, today } from "@internationalized/date"


export const findNow = () => {
    return today(getLocalTimeZone()).toDate("America/Santiago")
}