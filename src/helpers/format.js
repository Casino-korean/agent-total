import moment from "moment"

export function formatNumber(value, minFraction = 0, maxFraction = 4) {
    if (void 0 === value) {
        return 0;
    }
    try {
        var formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction
        });
        return formatter.format(value);
    } catch (error) {
        console.log(error)
        return value
    }
}

export function formatDateTime(time, format = "YYYY-MM-DD HH:mm:ss") {
    return moment(time).utcOffset("Asean/Ho_Chi_Minh").format(format)
}