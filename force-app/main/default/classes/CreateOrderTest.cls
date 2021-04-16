@isTest
public class CreateOrderTest {
    
    @testSetup
    static void createTestObjects() {
        
        Shoe_Product__c newShoe = new Shoe_Product__c(
            Brand__c = 'Adidas',
            Category__c = 'Football',
            Color__c = 'Blue',
            Gender__c = 'Male', 
            Price__c = 450,
            Name = 'Adidas Football',
            water_proof__c = 'Not Water Proof',
            stock_number__c = 100,
            Picture_URL__c = 'https://i.ibb.co/ZGsm8pV/adidas-spikes-blue.jpg'
            
        );
        
        insert newShoe;

        
    }
         
    @isTest
    static void testCreateOrder() {
        
        
        CreateOrder.createShoeOrder('[{"id":"a0C4K000000OxsrUAC","quantity":1,"name":"Adidas SuperStar Red","price":200,"priceInCart":200}]');
        
    }
    
    
}