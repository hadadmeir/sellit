var MenuExample = React.createClass({
	products: [],
	orders: [],
	ordersMap: {},
	productsMap: {},
	currentIndex: 1,
	itemDetails: null,

	getData: function () {
		$.ajax({
			method: "GET",
			url: 'http://sellit-ebay-sdk-ofear.c9users.io/products',
			dataType: "json",
			success: function( data ) {
				if (data) {
					for (var i = 0, resultsLength = data.length; i < resultsLength; i++) {
						if (data[i].itemId) {
							this.productsMap[data[i]._id] = data[i];
						}
					}
					this.products = data;
				}
			}.bind(this)
		})

		$.ajax({
			method: "GET",
			url: 'server/getOrders.json', //'http://sellit-ebay-sdk-ofear.c9users.io/orders',
			dataType: "json",
			success: function( data ) {
				var filteredResults = [];
				for (var i = 0, resultsLength = data.length; i < resultsLength; i++) {
					if (data[i].itemId) {
						filteredResults.push (data[i]);
						this.ordersMap[data[i]._id] = data[i];
					}
				}
				this.orders = filteredResults;
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

    tabClicked: function(index){
		this.setState({focused: index});
		this.currentIndex = index;
    },

    onProductClick: function (event) {
    	this.itemDetails = this.productsMap[event.currentTarget.dataset.id];
    	this.setState({itemDetails: this.itemDetails});
    },

    onOrderClick: function (event) {
    	this.itemDetails = this.ordersMap[event.currentTarget.dataset.id];
    	this.setState({itemDetails: this.itemDetails});
    },

    closeModal: function () {
    	this.itemDetails = null;
    	this.setState({itemDetails: this.itemDetails});
    },

    fileSelected: function () {
    	var count = document.getElementById('fileToUpload').files.length;
 		for (var index = 0; index < count; index ++) {
 
            var file = document.getElementById('fileToUpload').files[index];
			var fileSize = 0;
			if (file.size > 1024 * 1024) {
				fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			} else {
				fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
            }
      	}
    },

    takePicture: function () {
    	document.getElementById('fileToUpload').click();
    },

    render: function() {
        var self = this;
        return (
            <div>
                <div className="tabContainer">{ self.props.items.map(function(m, index){
                    var style = 'tab';
                    if(self.state.focused == index){
                        style = 'tabFocused';
                    }
                    return <div className={style} onClick={self.tabClicked.bind(self, index)}>{m}</div>;
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
                			if (self.currentIndex === 0) {
	                			return  <div className={className} onClick={self.onProductClick.bind(self)} data-id={m._id}>
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
                			if (self.currentIndex === 1) {
	                			return  <div className={className} onClick={self.onOrderClick.bind(self)} data-id={m._id}>
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
		            {(() => {
			            if (self.itemDetails) {
				            return <div id="itemDetailsPopup" className="itemDetailsPopup">
				            	<div className="modalBg"></div>
				            	<div id="itemDetails">
				            		<div>
				            			<h3>
				            				<img className="visible-xs floatLeft" src={self.itemDetails.galleryURL} />
				            				{self.itemDetails.title}
				            			</h3>
				            			<div className="itemImageContainer hidden-xs">
				            				<img src={self.itemDetails.galleryURL} />
				            			</div>
				            			<div className="detailsContainer">
				            				<div className="subTitle">General</div>
				            				<div className="row">
			                					<div className="col-xs-6 col-sm-6 col-md-6">Price</div>
				                    			<div className="col-xs-6 col-sm-6 col-md-6">{'$' + self.itemDetails.sellingStatus.currentPrice.amount}</div>
			                    			</div>
			                    			<div className="row">
				                    			<div className="col-xs-6 col-sm-6 col-md-6">Status</div>
				                    			<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.sellingStatus.sellingState || ''}</div>
			                    			</div>
			                    			<div className="row">
				                    			<div className="col-xs-6 col-sm-6 col-md-6">Qantity</div>
				                    			<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.sellingStatus.bidCount || '0'}</div>
			                    			</div>
			                    			<div className="row">
				                    			<div className="col-xs-6 col-sm-6 col-md-6">Address</div>
				                    			<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.location || ''}</div>
			                    			</div>
			                    			<div className="row">
				                    			<div className="col-xs-6 col-sm-6 col-md-6">Payment Method</div>
				                    			<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.paymentMethod || ''}</div>
			                    			</div>
			                    			<div>
				                    			<div className="subTitle">Shipping</div>
				                    			<div className="row">
				                    				<div className="col-xs-6 col-sm-6 col-md-6">Shipping Cost</div>                    
				                    				<div className="col-xs-6 col-sm-6 col-md-6">${self.itemDetails.shippingInfo.shippingServiceCost.amount || '0'}</div>
			                    				</div>
			                    				<div className="row">
				                    				<div className="col-xs-6 col-sm-6 col-md-6">Shipping Type</div>                    
				                    				<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.shippingInfo.shippingType || ''}</div>
			                    				</div>
			                    				<div className="row">
				                    				<div className="col-xs-6 col-sm-6 col-md-6">Handling Time</div>                    
				                    				<div className="col-xs-6 col-sm-6 col-md-6">{self.itemDetails.shippingInfo.handlingTime || '0'} days</div>
			                    				</div>
			                    			</div>
				            			</div> 
				            			<div className="buttonsContainer">
		                    				<input type="button" className="btn btn-primary" value="Update" onClick={self.editState} />
		                    				<input type="button" className="btn btn-primary" value="Pack Picture" onClick={self.takePicture} />
		                    				<input type="button" className="btn btn-danger" value="Close" onClick={self.closeModal} />
		                    			</div>
				            		</div>
				            		<input type="file" name="fileToUpload" id="fileToUpload" onChange="{self.fileSelected}" accept="image/*" capture="camera" />
				            	</div>
				            </div>;
			        	}
			        })()}
            </div>
        );
    }
});

ReactDOM.render(<MenuExample items={ ['Products', 'Orders'] } />,document.getElementById('container'));