import { browser, by, element } from 'protractor';

export class RegisterPage {

    // Datos para el registro positivo
    private registerPositive = {
        name: 'name-e2e-44',
        surname: 'surname-e2e',
        role: 'Explorer',
        email: 'email-e2e-044@gmail.com',
        // A la hora de las pruebas y crear un usuario NUEVO hay que ir modificando el email, ya que se va almacenando dentro de firebase
        address: 'address-e2e',
        phone: 'phone-e2e',
        password: '12345678CCC'
    };

    login = {
        // Este email y password debe ser el mismo que el del usuario que hemos registrado justo arriba para poder hacer así su login
        email: 'email-e2e-044@gmail.com',
        password: '12345678CCC'
    };

    // Datos para el registro negativo
    private registerNegative = {
        name: 'name-e2e-010',
        surname: 'surname-e2e',
        role: 'Explorer',
        email: 'email-e2e-010@gmail.com',
        address: 'address-e2e',
        phone: '698856772',
        password: '123'
    };

    navigateTo() {
        return browser.get('/register');
    }

    // Método para obtener el título
    getTitleText () {
        const selector = 'body > app-root > div > app-register > div > div > article > h4';
        return element(by.css(selector)).getText();
    }

    // Método para rellenar todos los campos del registro
    fillRegisterPositive(register: any = this.registerPositive) {
        const buttonSelector = 'body > app-root > div > app-register > div > div > article > form > div:nth-child(9) > button';
        // Con .sendKeys actualizamos los campos del registro
        element(by.css('#name')).sendKeys(register.name);
        element(by.css('#surname')).sendKeys(register.surname);
        element(by.css('#role')).sendKeys(register.role);
        element(by.css('#email')).sendKeys(register.email);
        element(by.css('#address')).sendKeys(register.address);
        element(by.css('#phone')).sendKeys(register.phone);
        element(by.css('#password')).sendKeys(register.password);
        // Hacemos click en el botón de entrar
        element(by.css(buttonSelector)).click();
    }

    fillRegisterNegative(register: any = this.registerNegative) {
        const buttonSelector = 'body > app-root > div > app-register > div > div > article > form > div:nth-child(9) > button';
        // Con .sendKeys actualizamos los campos del registro
        element(by.css('#name')).sendKeys(register.name);
        element(by.css('#surname')).sendKeys(register.surname);
        element(by.css('#role')).sendKeys(register.role);
        element(by.css('#email')).sendKeys(register.email);
        element(by.css('#address')).sendKeys(register.address);
        element(by.css('#phone')).sendKeys(register.phone);
        element(by.css('#password')).sendKeys(register.password);
        // Hacemos click en el botón de entrar
        element(by.css(buttonSelector)).click();
    }
}
