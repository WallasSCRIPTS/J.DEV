const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

contactForm.addEventListener('submit', (event) => {
	event.preventDefault();

	if (!contactForm.checkValidity()) {
		contactForm.reportValidity();
		return;
	}

	const name = document.querySelector('#nome').value.trim();
	formStatus.textContent = `Obrigado, ${name}! Sua mensagem foi recebida.`;
	contactForm.reset();
});
