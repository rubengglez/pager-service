const InvalidType = require("../../shared/domain/InvalidType");

class Targets {
    #emails
    #phoneNumbers

   constructor(emailList, phoneNumberList) {
       Targets.#checkArray(emailList)
       Targets.#checkArray(phoneNumberList)
       this.#emails = emailList
       this.#phoneNumbers = phoneNumberList
   }

   static #checkArray(list) {
      if (!Array.isArray(list)) {
          throw new InvalidType(`an array is expected, given ${typeof list}`)
      }
   }

   emails() {
        return this.#emails
   }

   phoneNumbers() {
        return this.#phoneNumbers
   }
}

module.exports = Targets