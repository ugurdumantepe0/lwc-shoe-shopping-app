@isTest
public class ShoeControllerTest {
    @testSetup
    static void createProducts() {
        List<Shoe_Product__c> products = new List<Shoe_Product__c>();

        products.add(
            new Shoe_Product__c(
                Brand__c = 'Adidas',
                Category__c = 'Football',
                Color__c = 'Blue',
                Gender__c = 'Male', 
                Price__c = 450,
                Name = 'Adidas Football',
                water_proof__c = 'Not Water Proof',
                stock_number__c = 100,
                Picture_URL__c = 'https://i.ibb.co/ZGsm8pV/adidas-spikes-blue.jpg'
            )
        );
        
        products.add(
            new Shoe_Product__c(
                Brand__c = 'Nike',
                Category__c = 'Tennis',
                Color__c = 'Green',
                Gender__c = 'Unisex', 
                Price__c = 400,
                Name = 'Nike Court Air Zoom Vapor X',
                water_proof__c = 'Water Proof',
                stock_number__c = 100,
                Picture_URL__c = 'https://i.ibb.co/VYx9rg4/nike-court-air-zoom-vapor-X.jpg'
            )
        );

        insert products;
    }

    @isTest
    static void testGetProducts() {
        ShoeController.Filters filters = new ShoeController.Filters();
        filters.searchKey = 'Sample';
        filters.maxPrice = 500;
        filters.categories = new List<String>{ 'Daily' };
        filters.genders = new List<String>{ 'Unisex' };
        filters.colors = new List<String>{ 'Balck' };
        filters.waterproofs = new List<String>{ 'Water Proof' };
        filters.waterproofs = new List<String>{ 'Nike' };
            
        
        PagedResult result = ShoeController.getShoes(filters, 1);
        // System.assertEquals(result.records.size(), 2);
    }
}