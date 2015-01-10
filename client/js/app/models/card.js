$.App.Card = (function(ModelBase){

	function Card(){

	}

	Card.prototype =  Object.create(ModelBase.prototype);

	return Card;
	
}($.App.ModelBase));