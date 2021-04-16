//
// Generated by JSON2Apex http://json2apex.herokuapp.com/
//

public class LineItemJsonToApex {

	public class OrderLineItems {
		public String id {get;set;} 
		public Integer quantity {get;set;} 
		public String name {get;set;} 
		public Integer price {get;set;} 
        public Integer priceInCart {get;set;}

		public OrderLineItems(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'id') {
							id = parser.getText();
						} else if (text == 'quantity') {
							quantity = parser.getIntegerValue();
						} else if (text == 'name') {
							name = parser.getText();
						} else if (text == 'price') {
							price = parser.getIntegerValue();
                        } else if (text == 'priceInCart') {
                            priceInCart = parser.getIntegerValue();
						} else {
							System.debug(LoggingLevel.WARN, 'OrderLineItems consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
    
	public class JsonToApex {
		public List<OrderLineItems> orderLineItems {get;set;} 

		public JsonToApex(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'orderLineItems') {
							orderLineItems = arrayOfOrderLineItems(parser);
						} else {
							System.debug(LoggingLevel.WARN, 'JsonToApex consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	
	public static JsonToApex parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
		return new JsonToApex(parser);
	}
	
	public static void consumeObject(System.JSONParser parser) {
		Integer depth = 0;
		do {
			System.JSONToken curr = parser.getCurrentToken();
			if (curr == System.JSONToken.START_OBJECT || 
				curr == System.JSONToken.START_ARRAY) {
				depth++;
			} else if (curr == System.JSONToken.END_OBJECT ||
				curr == System.JSONToken.END_ARRAY) {
				depth--;
			}
		} while (depth > 0 && parser.nextToken() != null);
	}
	

    private static List<OrderLineItems> arrayOfOrderLineItems(System.JSONParser p) {
        List<OrderLineItems> res = new List<OrderLineItems>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new OrderLineItems(p));
        }
        return res;
    }





}