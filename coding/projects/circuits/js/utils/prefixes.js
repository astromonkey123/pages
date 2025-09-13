const prefixes = ["p", "n", "µ", "m", "", "k", "M", "G", "T"];

function formatValue(value, unit, precision) {
    if (value == 0) {
        return value + unit;
    }
    const log1e3 = (x) => Math.log(x) / Math.log(1e3);
    const location = Math.floor(log1e3(Math.abs(value) * 10));
    let index = location + 4;
    index = index > 8 ? 8 : index < 0 ? 0 : index
    const prefix = prefixes[index];
    const adjusted_unit = prefix + unit;

    if (precision == null) {
        if (location === 0) {
            return value + adjusted_unit;
        }
        return (value / Math.pow(1e3, location)) + adjusted_unit;
    }

    if (location === 0) {
        return value.toFixed(precision) + adjusted_unit;
    }
    return (value / Math.pow(1e3, location)).toFixed(precision) + adjusted_unit;
}

export { formatValue };