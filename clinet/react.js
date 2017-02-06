var MenuExample = React.createClass({
	products: [],
	orders: [],
	currentIndex: 1,

	getData: function () {
		$.ajax({
			method: "GET",
			url: 'http://sellit-ebay-sdk-ofear.c9users.io/products',
			dataType: "json",
			success: function( data ) {
				this.products = data;
			}.bind(this)
		})

		$.ajax({
			method: "GET",
			url: 'http://sellit-ebay-sdk-ofear.c9users.io/orders',
			dataType: "json",
			success: function( data ) {
				this.orders = data;
				this.setState({focused: 1});
			}.bind(this)
		})
	},
	componentWillMount : function () {
	    this.getData();
	},
    getInitialState: function(){
        return { focused: this.currentIndex };
    },

    clicked: function(index){
		this.setState({focused: index});
		this.currentIndex = index;
    },

    render: function() {
        var self = this;
        return (
            <div>
                <div className="tabContainer">{ this.props.items.map(function(m, index){
                    var style = 'tab';
                    if(self.state.focused == index){
                        style = 'tabFocused';
                    }
                    return <div className={style} onClick={self.clicked.bind(self, index)}>{m}</div>;
                }) }  
                </div>
                <div className="visible-md visible-lg">
                	{(() => {
                		if (self.currentIndex === 0) {
            				return  <div className="row header">
		                    			<div className="col-md-4">Name</div>
		                    			<div className="col-md-4">Description</div>
		                    			<div className="col-md-4">Price</div>
		                    		</div>;
            			} else {
            				return  <div className="row header">
		                    			<div className="col-md-3">Name</div>
		                    			<div className="col-md-2">Price</div>
		                    			<div className="col-md-2">Status</div>
		                    			<div className="col-md-2">Qantity</div>
		                    			<div className="col-md-3">Address</div>
		                    		</div>;
            			}
                	})()}
                </div>
                <div>
                	{ 
                		self.products.map(function(m, index){
                			var className = ('row ' + ((index%2 === 0)? 'gridRow1' : 'gridRow2'));
                			if (this.currentIndex === 0) {
	                			return  <div className={className}>
	                					<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Name</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-4">{m.title || ''}</div>
		                    			<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Description</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-4">{m.description || ''}</div>
		                    			<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Price</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-4">{'$' + m.price}</div>
		                    		</div>;
                			}
                		}.bind(self))
                	}
                	{
                		self.orders.map(function(m, index){
	                		var className = ('row ' + ((index%2 === 0)? 'gridRow1' : 'gridRow2'));
                			if (this.currentIndex === 1) {
	                			return  <div className={className}>
	                					<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Name</div>
	                					<div className="col-xs-6 col-sm-6 col-md-3">{m.title || ''}</div>
	                					<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Price</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-2">{'$' + m.sellingStatus.currentPrice.amount}</div>
		                    			<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Status</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-2">{m.sellingStatus.sellingState || ''}</div>
		                    			<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Qantity</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-2">{m.sellingStatus.bidCount || ''}</div>
		                    			<div className="col-xs-6 col-sm-6 visible-sm visible-xs">Address</div>
		                    			<div className="col-xs-6 col-sm-6 col-md-3">{m.location || ''}</div>
		                    		</div>;
	                		}
                		}.bind(self))
		                
		            }  
                </div>
            </div>
        );
    }
});

ReactDOM.render(<MenuExample items={ ['Products', 'Orders'] } />,document.getElementById('container'));