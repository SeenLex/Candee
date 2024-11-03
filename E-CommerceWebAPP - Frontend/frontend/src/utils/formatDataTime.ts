const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} - ${hours}:${minutes}`;
};
const getNumberOfDays = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDifference = date.getTime() - today.getTime();
    const daysDifference = -Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

export {formatDateTime, getNumberOfDays};