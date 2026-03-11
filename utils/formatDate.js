const formatDate = (date) => {
    if (!date) return "Vaqt yo'q";
    return new Date(date).toLocaleString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

module.exports = formatDate;