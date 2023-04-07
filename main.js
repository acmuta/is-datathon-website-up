let oldStatus = undefined

const { WEBHOOK_URL } = process.env
if (!WEBHOOK_URL) {
	throw new Error('WEBHOOK_URL required')
}

const check = async () => {
	try {
		const response = await fetch('https://datathon.library.uta.edu', {
			headers: {
				'User-Agent': 'JaneIRL/is-datathon-website-up'
			}
		})
		updateStatus(response.status)
		oldStatus = response.status
	} catch (e) {
		console.error(e)
	} finally {
		setTimeout(check, 60_000)
	}
}

/**
 * @param {number} newStatus 
 */
const updateStatus = async (newStatus) => {
	if (oldStatus !== newStatus) {
		const isGood = newStatus === 200
		console.log(`[${isGood}] Status code changed: ${newStatus}`)
		await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				content: `${isGood ? ':green_circle:' : ':red_square:'} <https://datathon.library.uta.edu> responded with ${newStatus}`,
			}),
		})
	}
}

check();
