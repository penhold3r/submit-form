/* eslint-disable */
//--------------------------------------------------------
//>>   SUBMIT FORMS
//--------------------------------------------------------
/**
 *
 * @param {HTMLFormElement} form - reference to form elemnt
 * @param {Object.<string, *>} settings - settings before send
 */
const submitForm = (form, settings) => {
	if (!settings || !form) {
		console.warn('Must configure form settings')
		return false
	} else if (!settings.dest) console.warn('Must set "dest" property: example – "dest":"/contact"')
	else if (!settings.fields)
		console.warn('Must set "fields" property value with input class name.')
	else {
		form.setAttribute('novalidate', '')
		submitFormData(form, settings)
	}
}
//
const submitFormData = (form, settings) => {
	const fields = form.querySelectorAll(settings.fields)
	const msg = document.createElement('div')
	const validate = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/
	const formData = new FormData(form)
	const opt = { method: 'POST' }
	//
	for (let field of fields) {
		if (field.hasAttribute('required')) {
			if (
				field.value === '' ||
				(field.getAttribute('name') === 'email' && !validate.test(field.value))
			) {
				field.focus()
				return
			}
		}
	}
	//
	msg.classList.add('output-msg')
	msg.innerHTML = '<p></p>'
	if (!document.body.contains(document.querySelector('.output-msg'))) form.append(msg)
	//
	if (settings.closeMsg === 'true') {
		const msgClose = document.createElement('div')
		msgClose.classList.add('close-form-msg')
		msgClose.innerHTML = '&times;'
		msg.appendChild(msgClose)
		msgClose.addEventListener('click', e => msg.classList.remove('visible'))
	}
	//
	if (settings.name) formData.append('form-name', settings.name)
	if (settings.reciever) formData.append('dest', settings.reciever)
	//
	opt.headers = {
		'Content-Type': settings.urlencoded ? 'application/x-www-form-urlencoded' : 'application/json'
	}
	opt.body = settings.urlencoded ? urlencodeFormData(formData) : formData
	//
	process.env.NODE_MODE === 'development' && console.log('data: ', opt)
	//
	msg.querySelector('p').innerHTML = !settings.sending ? 'Sending...' : settings.sending
	msg.classList.add('visible')

	fetch(settings.dest, opt)
		.then(resp => {
			if (resp.ok) {
				msg.querySelector('p').innerHTML = !settings.successMsg ? 'ok' : settings.successMsg
				msg.querySelector('p').className = 'msg-ok'
				msg.classList.add('visible')
				form.reset()
				//
				process.env.NODE_MODE === 'development' && console.log('successful', opt)
			} else {
				msg.querySelector('p').innerHTML = !settings.errorMsg ? 'error' : settings.errorMsg
				msg.querySelector('p').className = 'msg-error'
				msg.classList.add('visible')
				form.reset()
				//
				process.env.NODE_MODE === 'development' && console.warn('failed')
			}
		})
		.catch(err => console.error('Error: ', err))
}
//
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
//
export default submitForm
