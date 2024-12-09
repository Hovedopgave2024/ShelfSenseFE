const calculateApiFetchTimeDif = (timestamp) => {
    if (!timestamp) return 'Unknown';

    const now = new Date();
    const updatedTime = new Date(timestamp);

    const diffInSeconds = Math.floor((now.getTime() - updatedTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    const hours = diffInHours % 24;

    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}${hours ? ` ${hours} hour${hours > 1 ? 's' : ''}` : ''} ago`;
};

export default calculateApiFetchTimeDif;