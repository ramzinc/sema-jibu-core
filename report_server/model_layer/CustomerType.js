// Returns information on a SalesChannel.

class CustomerType {
	constructor(cutsomerType) {
		this.id = cutsomerType.id;
		this.name = cutsomerType.name;
		this.description = cutsomerType.description;
	}
	classToPlain(){
		return {
			id:this.id,
			name:this.name,
			description:this.description };
	}
}

module.exports = CustomerType;
