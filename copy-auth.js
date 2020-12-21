
describe('testing auth', function(){
    it ('test case 1', function(){
        cy.authenticateSession().then((response =>{
            cy.request({
                method: "GET",
                url: 'http://localhost:3000/api/clients',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response =>{
                cy.log(response.body[0].id)
                cy.log(response.body[0].created)
                cy.log(response.body[0].name)
                cy.log(response.body[0].email)
                cy.log(response.body[0].telephone)

            }))
        }))
    })

    it.only('Create a new client', function(){
        cy.authenticateSession().then((response =>{
            const payload = {
                "name":"silva",
                "email":"silva@email.com",
                "telephone":"498374983734"
            }
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/client/new',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:payload
            }).then((response =>{
               //cy.log(JSON.stringify(response))
               const responseAsString = JSON.stringify(response)
               expect(responseAsString).to.have.string(payload.name)
            }))
        }))
    })

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
                
                
                //cy.log("New client id:" + newClientId)
                //cy.log("New client date: " + newClientDate )
        
                //cy.log(response.fakeNewClientPayload.name)
                //cy.log(response.fakeNewClientPayload.email)
                //cy.log(response.fakeNewClientPayload.telephone) 
                //const responseBodyAsString = JSON.stringify(response.body)
                   
            }))    
            
            assertNewClientRequest(cy,fakeNewClientPayload.name, fakeNewClientPayload.email, fakeNewClientPayload.telephone)
        }))
    }


})