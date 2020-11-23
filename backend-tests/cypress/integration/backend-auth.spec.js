
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


})