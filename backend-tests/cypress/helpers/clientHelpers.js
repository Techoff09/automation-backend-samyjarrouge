
const { fake } = require('faker')
const faker = require('faker')

function createFakeClientPayload(){
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()
    //const fakeId = faker.random.arrayElement(Array,[3])

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakePhone,     
    }
    return payload
}

function getAllClientsRequest(cy){
    cy.authenticateSession().then((response => {
        
        // GET request, fetch all clients
        cy.request({
            method:"GET",
            url: 'http://localhost:3000/api/clients',
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
           const responseAsString = JSON.stringify(response)
           expect(response.status).to.eq(200)
         
        }))
    
    }))

}

function createNewClientRequest(cy){
    cy.authenticateSession().then((response => {
            
        let fakeNewClientPayload = createFakeClientPayload()

        // Post request, create new client
        cy.request({
            method: "POST",
            url: 'http://localhost:3000/api/client/new',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeNewClientPayload
            
        }).then((response=> {
               
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(fakeNewClientPayload.name)
            
            let fakeNewClientId = response.body.id
            cy.log("Assert new client id:" + fakeNewClientId)   
        }))    
        
        assertNewClientInClientsPage(cy,fakeNewClientPayload.name, fakeNewClientPayload.email)

    }))
}

function assertNewClientInClientsPage(cy,name, email){ 
    cy.authenticateSession().then((response => {

        // GET request fetch all clients. Assert faker new client is added to 'clients/' page
        cy.request ({
            method:"GET",
            url: 'http://localhost:3000/api/clients',
            headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
            },      
        }).then((response=> {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        
        
        let fakeLastId = response.body[response.body.length-1].id
        expect(responseAsString).to.have.string(fakeLastId) 
        cy.log("Assert new client id:" + fakeLastId)            
        
        }))
    }))

}

function editNewClient(cy) {
    createNewClientRequest(cy)
     
    cy.authenticateSession().then((response => {
        
        // GET request create new client: PUT request edit new client. Assert updated client info.
        cy.request({
            method:"GET",
            url: 'http://localhost:3000/api/clients',
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
            let fakeLastId = response.body[response.body.length-1].id
            let lastCreatedDate = response.body[response.body.length-1].created
            let lastName = response.body[response.body.length-1].name
            let lastPhone = response.body[response.body.length-1].telephone
            let updateEmail = "editemail@mail.com"
            const payload = {
                "name": lastName, 
                "email": updateEmail,
                "telephone": lastPhone,
                "id": fakeLastId,
                "created": lastCreatedDate,
            }    

            cy.request({
                method:"PUT",
                url: 'http://localhost:3000/api/client/' + fakeLastId,
                headers: {
                   'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                   'Content-Type': 'application/json'
                }, 
                body: payload
            }) .then((response => {
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(updateEmail)

            }))
         
        }))
    
    }))

}

function deleteLastClient(cy) {
    createNewClientRequest(cy)
     
    cy.authenticateSession().then((response => {
        
        // GET request create new client: DELETE request & delete created client. Assert deletetion is 'True'
        cy.request({
            method:"GET",
            url: 'http://localhost:3000/api/clients',
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
            let fakeLastId = response.body[response.body.length-1].id

            cy.request({
                method:"DELETE",
                url: 'http://localhost:3000/api/client/' + fakeLastId,
                headers: {
                   'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                   'Content-Type': 'application/json'
                }, 
            
            }) .then((response => {
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string("true")

            }))
         
        }))
    
    }))

}



module.exports = {
     createFakeClientPayload,
     getAllClientsRequest,
     createNewClientRequest,
     editNewClient,
     deleteLastClient   
}


