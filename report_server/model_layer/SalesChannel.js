// Returns information on a SalesChannel.

class SalesChannel {
	constructor(salesChannel) {
		this.id = salesChannel.id;
		this.name = salesChannel.name;
		this.description = salesChannel.description;
	}
	classToPlain(){
		return {
			id:this.id,
			name:this.name,
			description:this.description };
	}
}

module.exports = SalesChannel;
