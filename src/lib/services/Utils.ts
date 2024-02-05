export function isThisWeek(date: Date) {
	const now = new Date();

	// Start of the current week
	const startOfWeek = new Date(
		now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
	);

	// Reset the hours, minutes, seconds, and milliseconds to 0
	startOfWeek.setHours(0, 0, 0, 0);

	// End of the current week
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(endOfWeek.getDate() + 6); // Add 6 days to get to the end of the week (Sunday)
	endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

	// Reset the hours, minutes, seconds, and milliseconds of the given date to 0 for accurate comparison
	date.setHours(0, 0, 0, 0);

	return date >= startOfWeek && date <= endOfWeek;
}

export function isThisMonth(date: Date) {
	const now = new Date();

	// Start of the current month
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	// End of the current month
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Setting the last day of the current month

	// Reset the hours, minutes, seconds, and milliseconds of the given date to 0 for accurate comparison
	date.setHours(0, 0, 0, 0);

	return date >= startOfMonth && date <= endOfMonth;
}
