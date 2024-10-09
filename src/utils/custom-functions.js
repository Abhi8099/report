export function formated_date(date_string) {
    const date = new Date(date_string);

// Define an array of month names
    const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    // Get the day, month, and year from the date object
    var  day = date.getDate();
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();

    // Format the date as "30 July, 2024"
    return day+ " " + month + ", "+year
    
}