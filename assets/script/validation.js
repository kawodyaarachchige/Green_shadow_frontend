const validation = {

    // Regex to validate scientific names (e.g., "Solanum lycopersicum")
    validateScientificName: (name) => {
        const regex = /^[A-Za-z]+ [A-Za-z]+$/;
        return regex.test(name);
    },

    // Regex to validate common names (letters, spaces, hyphens)
    validateCommonName: (name) => {
        const regex = /^[A-Za-z\s-]+$/;
        return regex.test(name);
    },

    // Regex to validate categories (letters and spaces only)
    validateCategory: (category) => {
        const regex = /^[A-Za-z\s]+$/;
        return regex.test(category);
    },

    // Validate seasons (e.g., Spring, Summer, Autumn, Winter)
    validateSeason: (season) => {
        const validSeasons = ["Spring", "Summer", "Autumn", "Winter"];
        return validSeasons.includes(season);
    },

    // Validate image file (size and format)
    validateImage: (file) => {
        const validFormats = ["image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return validFormats.includes(file.type) && file.size <= maxSize;
    }
};
