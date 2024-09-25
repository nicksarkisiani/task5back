const {Faker, ru, en_US, es, fakerRU, en} = require("@faker-js/faker")
const {chance} = require("chance")

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
        this.deleteSymbolError = this.deleteSymbolError.bind(this);
        this.changeIndexError = this.changeIndexError.bind(this);
        this.addSymbolError = this.addSymbolError.bind(this);
        this.oneErrorInData = this.oneErrorInData.bind(this);
    }


    async generateData(req, res) {
        try {
            const {locale, seed, errorCount, page} = req.body;
            let newSeed = seed + page
            const users = []

            const locales = {
                en,
                ru,
                es
            }
            const faker = new Faker({locale: locales[locale]})
            this.faker = faker
            faker.seed(newSeed)
            for(let i = 0; i < 10; i++) {

                const user = this.generateRandomUser(locale)
                newSeed += 10000000
                faker.seed(newSeed)
                if (errorCount === 0) {
                    users.push(user)
                    continue
                }
                const errorUser = this.generateError(user, errorCount)
                users.push(errorUser)
            }
            res.send(users)
        } catch (e) {
            console.log(e)
        }
    }

    generateRandomUser(locale) {

        return {
            id: this.generateID(locale),
            name: this.generateFullName(),
            phone: this.generatePhoneNumber(),
            address: this.generateAddress(),
        }
    }

    generateFullName() {
        return this.faker.person.fullName()
    }

    generatePhoneNumber() {
        const formats = ["human", "international", "national"]
        const f = formats[this.getRandomInt(formats.length) - 1]
        return this.faker.phone.number({style: f})
    }

    getRandomInt(max, min = 1) {
        return this.faker.number.int({max, min})
    }

    generateAddress() {
        let address = ""
        if (this.getRandomInt(this.faker, 2) % 2 === 0) address += `${this.faker.location.state()}, `
        address += `${this.faker.location.city()}, ${this.faker.location.streetAddress()}`
        if (this.getRandomInt(this.faker, 2) % 2 === 0) address += ` ${this.faker.location.secondaryAddress()}`
        return address
    }

    generateID(locale) {
        const ids = {
            ru: this.generateRuID,
            en: this.generateUsID,
            es: this.generateEsID
        }
        return ids[locale]()
    }


    generateRuID() {
        return this.getRandomSequence(4) + " " + this.getRandomSequence(6);
    }

    generateUsID() {
        return `${this.faker.string.alpha({length: 2, casing: "upper"})}${this.getRandomSequence(7)}`
    }

    generateEsID() {
        return `${this.getRandomSequence(8)}${this.faker.string.alpha({length: 1, casing: "upper"})}`
    }

    getRandomSequence(sequenceLength) {
        let s = ""
        for (let i = 0; i < sequenceLength; i++) {
            s += this.getRandomInt(9, 0)
        }
        return s;
    }

    changeIndexError(str) {

        const strArr = str.split("")
        const to = this.getRandomInt(str.length - 2, 0)
        let t = strArr[to]
        let t2 = strArr[to + 1]
        strArr[to] = t2
        strArr[to + 1] = t
        return strArr.join("")


    }

    addSymbolError(str) {
        const strArr = str.split("")
        const to = this.getRandomInt(str.length - 1, 0)
        if (this.getRandomInt(1, 0)) {
            const int = this.getRandomInt(9, 0)
            let firstPart = strArr.slice(0, to)
            firstPart.push(int)
            firstPart = firstPart.concat(...strArr.slice(to))
            return firstPart.join("")

        } else {
            let letter = this.faker.string.alpha({length: 1})

            if (this.getRandomInt(1, 0)) {
                letter = letter.toUpperCase()
            }
            let firstPart = strArr.slice(0, to)
            firstPart.push(letter)
            firstPart = firstPart.concat(strArr.slice(to))
            return firstPart.join("")
        }


    }

    deleteSymbolError(str) {
        const strArr = str.split("")
        const to = this.getRandomInt(str.length - 1, 0)
        return strArr.slice(0, to).concat(strArr.slice(to + 1)).join("")
    }

    oneErrorInData(str, key) {
        const errorTypes = [this.addSymbolError, this.deleteSymbolError, this.changeIndexError]
        let temp = String(str)

        let t = this.getRandomInt(errorTypes.length - 1, 0)
        if (temp.length < 3 && errorTypes[t] !== this.addSymbolError) {
            return temp
        }
        if (temp.length > 20 && errorTypes[t] === this.addSymbolError) {
            return temp
        }
        temp = errorTypes[t](temp)
        return temp


    }

    randomErrorInUser(user, errorCount) {
        const keys = Object.keys(user)
        for (let i = 0; i < errorCount; i++) {
            const randomIndex = this.getRandomInt(keys.length - 1, 0)
            const newValue = this.oneErrorInData(user[keys[randomIndex]], keys[randomIndex])
            user[keys[randomIndex]] = newValue
        }
        return user
    }

    generateError(user, errorCount) {
        const rounded = Math.floor(errorCount)
        user = this.randomErrorInUser(user, rounded)
        if (rounded !== errorCount) {
            const isError = !!this.getRandomInt(1, 0)
            if (isError) {
                user = this.randomErrorInUser(user, 1)
            }
        }
        return user
    }
}

module.exports = new Controller()