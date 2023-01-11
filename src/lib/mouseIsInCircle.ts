export function mouseIsInCircle(
	x: number,
	y: number,
	circleX: number,
	circleY: number,
	circleRadius: number
): boolean {
	// Calculate the distance between the click point and the center of the circle
	const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));

	// Return true if the distance is less than the circle radius, otherwise return false
	return distance < circleRadius;
}
