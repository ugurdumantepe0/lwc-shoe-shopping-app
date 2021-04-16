public with sharing class ShoeController {
    static Integer PAGE_SIZE = 9;

    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public Decimal maxPrice { get; set; }
        @AuraEnabled
        public String[] categories { get; set; }
        @AuraEnabled
        public String[] brands { get; set; }
        @AuraEnabled
        public String[] genders { get; set; }
        @AuraEnabled
        public String[] colors { get; set; }
        @AuraEnabled
        public String[] waterproofs { get; set; }
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getShoes(Filters filters, Integer pageNumber) {
        system.debug('incoming filters are : ' + filters);
        String key, whereClause = '';
        Decimal maxPrice;
        String[] categories, brands, colors, genders, waterproofs, criteria = new List<String>{};
        if (filters != null) {
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            genders = filters.genders;
            brands = filters.brands;
            colors = filters.colors;
            waterproofs = filters.waterproofs;

            if (!String.isEmpty(filters.searchKey)) {
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                criteria.add('Price__c <= :maxPrice');
            }
            if (filters.categories != null) {
                categories = filters.categories;
                criteria.add('Category__c IN :categories');
            }
            if (filters.brands != null) {
                brands = filters.brands;
                criteria.add('Brand__c IN :brands');
            }
            if (filters.genders != null) {
                genders = filters.genders;
                criteria.add('Gender__c IN :genders');
            }
            if (filters.colors != null) {
                colors = filters.colors;
                criteria.add('Color__c IN :colors');
            }
            if (filters.waterproofs != null) {
                waterproofs = filters.waterproofs;
                criteria.add('Water_Proof__c IN :waterproofs');
            }
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }
        }
        system.debug('where claus : ' + whereClause);
        Integer pageSize = ShoeController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result = new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM Shoe_Product__c ' + whereClause
        );
        result.records = Database.query(
            'SELECT Id, Name, Price__c, Category__c, Water_Proof__c, Stock_Number__c, Brand__c, Picture_URL__c, Gender__c FROM Shoe_Product__c ' +
            whereClause +
            // ' WITH SECURITY_ENFORCED' +
            ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
        );
        
        system.debug(result);
        return result;
    }


}