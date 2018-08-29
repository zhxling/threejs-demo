
function formatDate() {
    return (value, minute) => {
        if (value) {
            let apartMinute = moment(value).startOf('minute').fromNow();

            return parseInt(minute, 10) >= parseInt(apartMinute, 10) ? apartMinute : `${value} alin`;
        }
        return value;

    };
}

formatDate.$inject = [];

export default formatDate;
