const endpoint_POST_logout = 'http://localhost:3000/api/logout'
const endpoint_POST_newClient = 'http://localhost:3000/api/client/new'
const endpoint_GET_clients = 'http://localhost:3000/api/clients'
const endpoint_PUT_editClient = 'http://localhost:3000/api/client/'
const endpoint_DELETE_deleteClient = 'http://localhost:3000/api/client/'


function assertLoginLogoutRequest(cy) { 
    
    cy.authenticateSession().then((response => {
       
        // Doesn't work: cy.getCookie('cypress-session-cookie').should('exist') 
        
        
        /* POST request for login above & for logout endpoints.
        Assert status code & response payload 'OK'. */
        
        cy.request({
            method:"POST",
            url: endpoint_POST_logout,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },      
            
        }).then((response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.eq("OK") 
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
            
            // expect(responseAsString).to.have.string('"body":"OK"')                            
        }))
        
    }))
}


function getTotalAmountOfClientsRequest(cy){
    cy.authenticateSession().then((response => {

        // GET request, fetch number of clients
        cy.request({
            method:"GET",
            url: endpoint_GET_clients,
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {

            expect(response.status).to.eq(200)
            expect(response.body[0]).to.have.property('id')
            cy.log(response.body)       // ? does not output Array[nr] but [Object{nr}]
            cy.log("Total clients: " + response.body.length)
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)           
         
        }))
    
    }))
}

// faker.js below generates fake new client test data 

const { fake } = require('faker')
const faker = require('faker')

function createFakeClientPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakePhone,     
    }
    return payload
}

function createNewClientRequest(cy){
    cy.authenticateSession().then((response => {
            
        let fakeNewClientPayload = createFakeClientPayload()

        // Post request, create a new client w faker.js
        cy.request({
            method: "POST",
            url: endpoint_POST_newClient,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'    
            },
            body:fakeNewClientPayload
            
        }).then((response=> {
            
            const responseAsString = JSON.stringify(response.body)
            expect({name:1, email:2, telephone:3, id:4, created:5}).to.be.an('object')
            .that.has.all.keys('name', 'email', 'telephone', 'id', 'created')
            
            let newClientId = response.body.id
            let newClientDate = response.body.created
            
            expect(responseAsString).to.have.string(fakeNewClientPayload.name)
            expect(responseAsString).to.have.string(fakeNewClientPayload.email)
            expect(responseAsString).to.have.string(fakeNewClientPayload.telephone)
            expect(responseAsString).to.have.string(newClientId)
            expect(responseAsString).to.have.string(newClientDate)
               
        }))    
        
        assertNewClientRequest(cy,fakeNewClientPayload.name, fakeNewClientPayload.email, fakeNewClientPayload.telephone)
    }))
}


function assertNewClientRequest(cy, name, email, telephone){ 
    cy.authenticateSession().then((response => {

        // GET request fetch all clients. Assert faker new client is added to 'clients/' page
        cy.request ({
            method:"GET",
            url: endpoint_GET_clients,
            headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'

            },       
        }).then((response=> {
            let lastClientId = response.body[response.body.length-1].id
            let lastCreatedClientDate = response.body[response.body.length-1].created
            cy.log(response.body)
            
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(name)
            expect(responseAsString).to.have.string(email)
            expect(responseAsString).to.have.string(telephone) 
            expect(responseAsString).to.have.string(lastClientId) 
            expect(responseAsString).to.have.string(lastCreatedClientDate)
            
            
            cy.log("Assert client total:" + lastClientId + " should match last id")
            cy.log("Assert new client date created: " + lastCreatedClientDate)            
        
        }))

    }))
}

function editNewClientRequest(cy) {
    createNewClientRequest(cy)
     
    cy.authenticateSession().then((response => {
        
        // GET request create new client: PUT request edit the new client. Assert updated client info.
        cy.request({
            method:"GET",
            url: endpoint_GET_clients,
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
            let lastClientId = response.body[response.body.length-1].id
            let lastCreatedDate = response.body[response.body.length-1].created
            let lastClientName = response.body[response.body.length-1].name
            let lastClientPhone = response.body[response.body.length-1].telephone
            let lastClientEmail = response.body[response.body.length-1].email
            let updatedLastClientEmail = "Edit-email@mail.com"
            
            const payload = {
                "name": lastClientName, 
                "email": updatedLastClientEmail,
                "telephone": lastClientPhone,
                "id": lastClientId,
                "created": lastCreatedDate,
            }    

            cy.request({
                method:"PUT",
                url: endpoint_PUT_editClient + lastClientId,
                headers: {
                   'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                   'Content-Type': 'application/json'
                }, 
                body: payload

            }) .then((response => {
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(updatedLastClientEmail)
                cy.log("new client email before edit: " + lastClientEmail)
                cy.log("new client email updated to: " + updatedLastClientEmail)

            }))
         
        }))
    
    }))
}

function deleteLastClientRequest(cy) {
    createNewClientRequest(cy)
     
    cy.authenticateSession().then((response => {
        
        // GET request, create new client. DELETE request, delete created client.
        // Assert deletetion is 'True'. System logout, assert 'OK'.

        cy.request({
            method:"GET",
            url: endpoint_GET_clients,
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
            let lastClientId = response.body[response.body.length-1].id

            cy.request({
                method: "DELETE",
                url: endpoint_DELETE_deleteClient + lastClientId,
                headers: {
                   'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                   'Content-Type': 'application/json'
                }, 
            
            }) .then((response => {
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string('{"ok":true}') 
                
            }))
         
        }))            
            cy.request({
                method:"POST",
                url: endpoint_POST_logout,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },      
            
            }).then((response => {
                expect(response.status).to.eq(200)
                expect(response.body).to.eq("OK") 
                const responseAsString = JSON.stringify(response)
                cy.log(responseAsString)
            
            // expect(responseAsString).to.have.string('"body":"OK"')                               

            })) 

    }))
}


module.exports = {
     assertLoginLogoutRequest,  
     createFakeClientPayload,
     getTotalAmountOfClientsRequest,
     createNewClientRequest,
     editNewClientRequest,
     deleteLastClientRequest,
}


