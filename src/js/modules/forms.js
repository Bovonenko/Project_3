export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: "Loading...",
            success: "Thank You! We will contact you as soon as possible!",
            failure: "Something went wrong..."
        };
        this.path = 'assets/question.php';
    }

    clearInputs() {
        this.inputs.forEach(input => input.value = '');
    }

    checkMailInputs() {
        const Inputs = document.querySelectorAll('[type="email"]');

        Inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                if (input.value.match(/[^a-z 0-9 @ \.]/ig)) {
                    input.value = input.value.replace(/[^a-z 0-9 @ \.]/ig, '');
                }
            });
        });
    }

    initMask() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();
    
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
    
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
    
        function createMask(event) {
            let matrix = '+1 (___) ___-___',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
    
            if (def.length >= val.length) {
                val = def;
            }
    
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('input', createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
    
        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMask();
        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                item.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                const formData = new FormData(item);

                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 6000);
                    });
            });
        });
    }

    


    
    
    // submitForm() {
    //     this.form.forEach(item => {
    //         item.addEventListener('submit', (e) => {
    //             e.preventDefault();
    
    //             let statusMessage = document.createElement('div');
    //             statusMessage.classList.add('status');
    //             item.parentNode.appendChild(statusMessage);
    
    //             item.classList.add('animated', 'fadeOutUp');
    //             setTimeout(() => {
    //                 item.style.display = 'none';   
    //             }, 400);
    
    //             let statusImg = document.createElement('img');
    //             statusImg.setAttribute('src', this.message.spinner);
    //             statusImg.classList.add('animated', 'fadeInUp');
    //             statusMessage.appendChild(statusImg);
    
    //             let textMessage = document.createElement('div');
    //                 textMessage.classList.add('animated', 'fadeInUp');
    //                 textMessage.textContent = this.message.loading;
    //                 statusMessage.appendChild(textMessage);
    
    //             const formData = new FormData(item);
    
    //             this.postData(this.path, formData)
    //                 .then(res => {
    //                     console.log(res);
    //                     textMessage.textContent = this.message.success;
    //                     statusImg.setAttribute('src', this.message.ok);
    //                 })
    //                 .catch(() => {
    //                     statusImg.setAttribute('src', this.message.fail);
    //                     textMessage.textContent = this.message.failure;
    //                 })
    //                 .finally(() => {
    //                     this.clearInputs();
                        
    //                     setTimeout(() => {
    //                         statusMessage.remove();
    //                         item.style.display = 'block';
    //                         item.classList.remove('fadeOutUp');
    //                         item.classList.add('fadeInUp');
    //                     }, 5000);
    
    //                 });
    //         });
    //     });
    // }
}