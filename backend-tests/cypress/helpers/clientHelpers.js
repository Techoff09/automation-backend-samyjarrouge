const faker = require('faker')

function createFakeClientPayload(){
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakePhone
    }
    return payload
}

/*function createClientPayload(){
    const name = 'Test'
    const email = 'tester@email.com'
    const 
} */


module.exports = {
     createFakeClientPayload,
    // createClientPayload,
}


