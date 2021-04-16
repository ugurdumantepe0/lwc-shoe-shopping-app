public with sharing class CreateOrder {
    @AuraEnabled
    public static void createShoeOrder(String lineItems) {
        
        lineItems = '{ "orderLineItems" : ' + lineItems + '}';
        
        system.debug(' incoming line items are : ' + lineItems);
               
        LineItemJsonToApex.JsonToApex parseResult = LineItemJsonToApex.parse(lineItems);
		       
        system.debug('parsed line items are : ' + parseResult);
        
        // Set<String> productIds = new Set<String>();
        List<Shoe_Order_Line_Item__c> orderLineItemList = new List<Shoe_Order_Line_Item__c>();
        
        Shoe_Order__c newOrder = new Shoe_Order__c();        
        insert newOrder;
        
        for(LineItemJsonToApex.orderLineItems lineItem : parseResult.orderLineItems) {
            
            Shoe_Order_Line_Item__c newLineItem = new Shoe_Order_Line_Item__c(Shoe_Product__c = lineItem.id,
                                                                              Quantity__c     = lineItem.quantity,
                                                                              Shoe_Order__c   = newOrder.id,
                                                                              Line_Total__c   = lineItem.priceInCart,
                                                                              Name            = lineItem.name);
            
            orderLineItemList.add(newLineItem);            
        }
        
        Database.insert(orderLineItemList);
        
        system.debug('newOrder is : ' + newOrder);
        
        system.debug('orderItemList is : ' + orderLineItemList);       
    }
}