# lwc-shoe-shopping-app

A simple shopping app developed with lwc and apex

This project has a simple data model with three custom objects. Shoe_Product__c, Shoe_Order_Line_Item__c and Shoe_Order__c. Check jpeg images for details about object and how the app looks.

There are three main components:

1- shoeFilter -> for filtering the products that is going to appear on the screen. it imports fields for custom object Shoe_Product__c as checkboxes. It also has a name search field and price slider. It has a child component filterError for error message when fields are failed to retrive.

2- productList -> The container products are gonna be displayed based on the filter. It has 3 child components within: 
  a- shoe -> for each product showed in the container
  b- paging -> for showing products in multiple pages and switching in between them.
  c- logo -> logo to show when there are no products to show

3- cart -> shopping cart component to show products selected in a data table. Has a button to call backend function createOrder to create record with the line items in the table


----TODO's----

1- no metadata for objects, fields, tabs, data etc.. add such stuff to make it easy to install and use for people.


2- data model can be more complex. products can have stock info and can have discount declared to them. fields exist for these on objects but are not used in implementation.


3- filters can show product numbers next to the checkboxes respectively.





