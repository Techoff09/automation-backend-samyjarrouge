

function assertLoginLogoutRequest(cy) { 
    
    cy.authenticateSession().then((response => {
       
        // Doesn't work: cy.getCookie('cypress-session-cookie').should('exist') 
        
        
        /*POST request for login above & for logout endpoints.
        Assert status code & response payload 'OK'. */
        
        cy.request({
            method:"POST",
            url: 'http://localhost:3000/api/logout',
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },      
            
        }).then((response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.eq("OK") 
            const responseAsString = JSON.stringify(response.body)
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
            url: 'http://localhost:3000/api/clients',
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
           const responseAsString = JSON.stringify(response.body)
           expect(response.status).to.eq(200)
           cy.log("Total clients: " + response.body.length)
           cy.log(response.body[0])
           cy.log(responseAsString)
           
           /*cy.log(response.body[0].created)
           cy.log(response.body[0].name)
           cy.log(response.body[0].email)
           cy.log(response.body[0].telephone) */
         
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

        // Post request, create new client w faker.js
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
               
            let newClientId = response.body.id
            cy.log("Assert new client is last id nr:" + newClientId)   
        }))    
        
        assertNewClientRequest(cy,fakeNewClientPayload.name, fakeNewClientPayload.email, fakeNewClientPayload.telephone)
    }))
}


function assertNewClientRequest(cy, name, email, telephone){ 
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
            cy.log("Total clients: " + response.body.length)
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(name)
            expect(responseAsString).to.have.string(email)
            expect(responseAsString).to.have.string(telephone)   
            
            let lastClientId = response.body[response.body.length-1].id
            expect(responseAsString).to.have.string(lastClientId) 
            cy.log("Assert last created client id nr:" + lastClientId)            
        
        }))

    }))
}

function editNewClientRequest(cy) {
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
            let lastClientId = response.body[response.body.length-1].id
            let lastCreatedDate = response.body[response.body.length-1].created
            let lastClientName = response.body[response.body.length-1].name
            let lastClientPhone = response.body[response.body.length-1].telephone
            let lastClientEmail = response.body[response.body.length-1].email
            let updateEmail = "Edit-email@mail.com"
            
            const payload = {
                "name": lastClientName, 
                "email": updateEmail,
                "telephone": lastClientPhone,
                "id": lastClientId,
                "created": lastCreatedDate,
            }    

            cy.request({
                method:"PUT",
                url: 'http://localhost:3000/api/client/' + lastClientId,
                headers: {
                   'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                   'Content-Type': 'application/json'
                }, 
                body: payload

            }) .then((response => {
                cy.log("new client email before edit was: " + lastClientEmail)
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(updateEmail)

            }))
         
        }))
    
    }))
}

function deleteLastClientRequest(cy) {
    createNewClientRequest(cy)
     
    cy.authenticateSession().then((response => {
        
        // GET request create new client: DELETE request, delete created client. Assert deletetion is 'True'
        cy.request({
            method:"GET",
            url: 'http://localhost:3000/api/clients',
            headers: {
               'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
               'Content-Type': 'application/json'
            },      
        }).then((response=> {
            let lastClientId = response.body[response.body.length-1].id

            cy.request({
                method:"DELETE",
                url: 'http://localhost:3000/api/client/' + lastClientId,
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
     assertLoginLogoutRequest,  
     createFakeClientPayload,
     getTotalAmountOfClientsRequest,
     createNewClientRequest,
     editNewClientRequest,
     deleteLastClientRequest,
}


