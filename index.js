const { serialize } = require('object-to-formdata')
/**
 *
 * @param {HTMLFormElement} form - reference to form elemnt
 * @param {Object.<string, *>} settings - settings before send
 */
const submitFormData = (form, settings) => {
	if (!settings || !form) {
		throw new Error('Must configure form settings')
	} else if (!settings.dest) {
		throw new Error('Must set "dest" property: example – "dest":"/contact"')
	} else if (!settings.fields) {
		throw new Error('Must set "fields" property value with input class name.')
	} else {
		const fields = form.querySelectorAll(settings.fields)

		form.setAttribute('novalidate', '')

		return send(form, fields, settings)
	}
}
//
const send = (form, fields, settings) => {
	const formData = new FormData(form)
	const opt = { method: 'POST', credentials: 'same-origin' }
	let bodyData
	//
	const { valid, field } = validate(fields)
	//
	if (settings.name) formData.append('form-name', settings.name)
	if (settings.reciever) formData.append('dest', settings.reciever)
	if (settings.wpAction) formData.append('action', settings.wpAction)
	if (settings.extraData && Object.keys(settings.extraData).length > 0) {
		devLog('extraData', settings.extraData)
		bodyData = serialize(settings.extraData, null, formData)
	}
	//
	settings.urlencoded = settings.urlencoded || true
	//
	opt.headers = {
		'Content-Type': settings.urlencoded
			? 'application/x-www-form-urlencoded'
			: 'application/json',
		'Cache-Control': 'no-cache',
	}
	opt.body = settings.urlencoded ? urlencodeFormData(bodyData) : bodyData
	//
	devLog('to send:', opt)
	//
	return new Promise((resolve, reject) => {
		valid
			? fetch(settings.dest, opt)
					.then(result => result.json())
					.then(resp => {
						devLog('RESPONSE: ', resp)

						form.reset()

						resolve({ ok: true, data: resp })
					})
					.catch(error => {
						reject({ ok: false, data: { error }, valid })
						devLog('Error: ', error)
					})
			: reject({ ok: false, data: { field }, valid })
	})
}
/**
 *
 * @param {NodeList} fields - List of fields inputs
 * @returns {Object}
 */
const validate = fields => {
	const regex = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/

	for (let field of fields) {
		if (field.hasAttribute('required')) {
			if (
				field.value === '' ||
				(field.getAttribute('name') === 'email' && !regex.test(field.value))
			) {
				field.focus()
				devLog('invalid input', field)
				return { field, valid: false }
			}
		}
	}
	return { valid: true }
}
/**
 *
 * @param {args} - args to be loged only in developement mode
 *
 */
const devLog = (...args) => {
	process.env.NODE_ENV && process.env.NODE_ENV === 'development' && console.log(...args)
}
/**
 *
 * @param {FormData} fd - FromData Object to encode
 * @returns {String}
 */
const urlencodeFormData = fd => {
	let str = ''
	const encode = str => encodeURIComponent(str).replace(/%20/g, '+')
	for (const pair of fd.entries()) {
		if (typeof pair[1] == 'string') {
			str += (str ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1])
		}
	}
	return str
}
//------------------------------------------------
module.exports = submitFormData
