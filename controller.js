
const {Faker, ru, en_US, es, fakerRU, en} = require("@faker-js/faker")

/*

   {
    locale: ,
    seed: ,
    errorCount: ,
    page:
   }

 */

class Controller {

    constructor() {
        this.generateData = this.generateData.bind(this);
        this.generateUsID = this.generateUsID.bind(this);
        this.generateRuID = this.generateRuID.bind(this)
        this.generateEsID = this.generateEsID.bind(this);
    }


    async generateData(req, res) {
        try {
            const {locale, seed, errorCount, page} = req.body;
            res.send(this.generateRandomUser(locale, seed))
        } catch (e) {
            console.log(e)
        }
    }

    generateRandomUser(locale, seed){

        const locales = {
            en,
            ru,
            es
        }

        const faker = new Faker({locale: locales[locale]})
        faker.seed(seed)
        return {
            id: this.generateID(faker, locale),
            name: this.generateFullName(faker),
            phone: this.generatePhoneNumber(faker),
            address: this.generateAddress(faker),
        }
    }

    generateFullName(f) {
        return f.person.fullName()
    }

    generatePhoneNumber(faker) {
        const formats = ["human", "international", "national"]
        const f = formats[this.getRandomInt(faker,formats.length) - 1]
        return faker.phone.number({style: f})
    }

    getRandomInt(faker, max, min = 1) {
        return faker.number.int({max, min})
    }

    generateAddress(faker) {
        let address = ""
        if (this.getRandomInt(faker,2) % 2 === 0) address += `${faker.location.state()}, `
        address += `${faker.location.city()}, ${faker.location.streetAddress()}`
        if (this.getRandomInt(faker,2) % 2 === 0) address += ` ${faker.location.secondaryAddress()}`
        return address
    }

    generateID(faker, locale) {
        const ids = {
            ru: this.generateRuID,
            en: this.generateUsID,
            es: this.generateEsID
        }

        return ids[locale](faker)
    }


    generateRuID(faker) {
        return this.getRandomSequence(faker,4) + " " + this.getRandomSequence(faker, 6);
    }

    generateUsID(faker) {
        return `${faker.string.alpha({length: 2, casing: "upper"})}${this.getRandomSequence(faker, 7)}`
    }

    generateEsID(faker) {
        return `${this.getRandomSequence(faker, 8)}${faker.string.alpha({length: 1, casing: "upper"})}`
    }

    getRandomSequence(faker, sequenceLength) {
        let s = ""
        for (let i = 0; i < sequenceLength; i++) {
            s += this.getRandomInt(faker, 9, 0)
        }
        return s;
    }
}

module.exports = new Controller()