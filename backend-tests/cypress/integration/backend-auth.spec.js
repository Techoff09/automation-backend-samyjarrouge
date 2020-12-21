
import * as clientHelpers from '../helpers/clientHelpers'


describe('Testing Auth', function(){
  
     
    // Test-case 01
   
    it ('Assert login & logout is successful', function(){
        clientHelpers.assertLoginLogoutRequest(cy)
    }) 


    // Test-case 02

    it ('Starting total number of clients w assertion', function(){
        clientHelpers.getTotalAmountOfClientsRequest(cy)
    })
    
    
    // Test-case 03

    it ('Create new faker client & assert new client', function(){
        clientHelpers.createNewClientRequest(cy)
    })


    // Test-case 04
   
    it ('Edit last created client & assert updated client info', function(){
        clientHelpers.editNewClientRequest(cy)
    }) 


    // Test-case 05
   
    it ('Delete last created client. Assert deletion is True. Logout & assert Ok', function(){
        clientHelpers.deleteLastClientRequest(cy)
    }) 


    



    
    // Test-case 01 (manuel) cy.log(response.body)

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


    
    
})
    





