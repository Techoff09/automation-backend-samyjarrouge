/* it('Perform valid login', function(){
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0' 
    -H 'Accept: application/json' 
    -H 'Accept-Language: en-US,en;q=0.5' 
    --compressed -H 'Referer: http://localhost:3000/login'
    -H 'Content-Type: application/json;charset=UTF-8' 
    -H 'Origin: http://localhost:3000' 
    -H 'Connection: keep-alive' 
    
    type('tester01')
    
    type('GteteqbQQgSr88SwNExUQv2ydb7xuf8c')   
}) */

import * as clientHelpers from '../helpers/clientHelpers'


describe('Testing Auth', function(){
  
    // Test-case 01

    it.only ('create a new client', function(){
        cy.authenticateSession().then((response => {
            
            let fakeClientPayload = clientHelpers.createFakeClientPayload()

            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/client/new',
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:fakeClientPayload
            }).then((response=> {
                //cy.log(response.body)
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(fakeClientPayload.name)
            }))
        }))
    })

    // Test-case 01 (manuel)

  /*  it.only ('create a new client', function(){
        cy.authenticateSession().then((response => {
            
            let clientPayload = clientHelpers.createClientPayload()

            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/client/new',
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:clientPayload
            }).then((response=> {
                //cy.log(response.body)
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(fakeClientPayload.name)
            }))
        }))
    }) */


    // Test-case 02

    it ('Assert new client on clients page', function(){
        cy.authenticateSession().then((response=>{
            cy.request({
                method:"GET",
                url: 'http://localhost:3000/api/clients',
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
    
                },
            }).then((response=> {
                cy.log(response.body[0].id)
                cy.log(response.body[0].created)
                cy.log(response.body[0].name)
                cy.log(response.body[0].email)
                cy.log(response.body[0].telephone)

            }))
        }))
    })
    
})
    





